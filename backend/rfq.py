# rfq.py
from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
from uuid import uuid4
import time

# Shared state
from state import rfqs, audit_events, auctions, bonds

# Reuse audit + timer from auctions module for consistency
try:
    from auctions import add_audit, run_auction_timer
except Exception:
    # Fallbacks (shouldn't be hit if auctions.py is present)
    def add_audit(event_type: str, payload: dict, auction_id: str = None):
        audit_events.append({"t": int(time.time() * 1000), "type": event_type, "auctionId": auction_id, "payload": payload})
    def run_auction_timer(auction_id: str):
        pass

router = APIRouter()

# -----------------------------
# Utilities
# -----------------------------
def now_ms() -> int:
    return int(time.time() * 1000)

def resolve_instrument(instrument_id: str) -> Dict[str, Any]:
    """
    Returns: {"parent": dict, "micro": Optional[dict]}
    Raises HTTPException if not found
    """
    parent = None
    micro = None
    for b in bonds.values():
        if b["id"] == instrument_id:
            parent = b
            break
        for mb in b.get("microBonds", []):
            if mb["id"] == instrument_id:
                parent = b
                micro = mb
                break
        if parent:
            break
    if not parent:
        raise HTTPException(status_code=404, detail="Bond/microBond not found")
    return {"parent": parent, "micro": micro}

def find_open_auction_for_instrument(instrument_id: str) -> Optional[str]:
    for aid, a in auctions.items():
        if a.get("instrumentId") == instrument_id and a.get("status") == "OPEN":
            return aid
    return None

def create_auction_inline(instrument_id: str, *, isin: str, lpStub: str, windowSeconds: int, bandOverride: Optional[float] = None) -> str:
    """
    Creates an auction object consistent with auctions.start_auction.
    Returns auction_id and starts the timer.
    """
    ids = resolve_instrument(instrument_id)
    parent = ids["parent"]
    auction_id = str(uuid4())
    t_open = now_ms()
    t_close = t_open + windowSeconds * 1000
    auctions[auction_id] = {
        "id": auction_id,
        "instrumentId": instrument_id,
        "meta": {
            "parentId": parent["id"],
            "faceValue": parent["faceValue"],
            "isin": isin,
            "lpStub": lpStub,
        },
        "orders": [],
        "status": "OPEN",
        "tOpenMs": t_open,
        "tCloseMs": t_close,
        "bandOverride": bandOverride,
        "band": None,
        "fills": [],
        "clearingPrice": None,
        "matchedNotional": None,
        "merkleRoot": None,
    }
    add_audit("AUCTION_START_INLINE", {"auctionId": auction_id, "instrumentId": instrument_id}, auction_id)
    run_auction_timer(auction_id)
    return auction_id

def fair_price_stub(parent_bond: dict, context: dict) -> Dict[str, Any]:
    """
    Very small deterministic stub to keep demos stable.
    Uses faceValue +/- small band; can be replaced with ML later.
    """
    fv = float(parent_bond.get("faceValue", 100.0))
    # Simple knobs from context
    side = context.get("side", "BUY")
    qty = float(context.get("qty", 0))
    micro_bias = -0.05 if context.get("micro") else 0.0   # illiquidity tiny discount
    size_bias = -0.02 if qty and qty > (fv * 0.1) else 0  # larger clip slightly tighter/worse
    base = fv + micro_bias + size_bias
    band = 0.50  # 50p band for demo
    if side == "BUY":
        explanation = f"Near face value with small illiquidity/size adjustments (BUY)."
    else:
        explanation = f"Near face value with small illiquidity/size adjustments (SELL)."
    return {
        "fairPrice": round(base, 2),
        "bandLow": round(base - band, 2),
        "bandHigh": round(base + band, 2),
        "explanation": explanation
    }

def build_rfq_dict(
    *,
    auctionId: str,
    instrumentId: str,
    userId: str,
    side: str,
    qty: float,
    limitPrice: Optional[float],
    timeInForce: str,
    parentId: str,
    microId: Optional[str],
    fair_stub: Dict[str, Any],
) -> Dict[str, Any]:
    rfq_id = str(uuid4())
    return {
        "id": rfq_id,
        "auctionId": auctionId,
        "instrumentId": instrumentId,   # could be parent bond id OR micro-bond id
        "parentId": parentId,           # always populated
        "microId": microId,             # None if instrumentId is parent
        "userId": userId,
        "side": side.upper(),           # BUY / SELL
        "qty": qty,
        "limitPrice": limitPrice,       # None = Market
        "timeInForce": timeInForce,     # GTC / AON / IOC (treated as GTC in auction window)
        "status": "OPEN",
        "ts": now_ms(),
        # Fill tracking
        "filledQty": 0.0,
        "avgFillPrice": None,
        # Fair price guidance (for per-RFQ audit/explainability)
        "fairPrice": fair_stub.get("fairPrice"),
        "bandLow": fair_stub.get("bandLow"),
        "bandHigh": fair_stub.get("bandHigh"),
        "explanation": fair_stub.get("explanation"),
        # Dealer quotes (optional; for bulletin-board style RFQ demonstration)
        "quotes": [],
        "acceptedQuote": None
    }

# -----------------------------
# 1) Create RFQ (supports bondId OR micro-bond-id)
# -----------------------------
@router.post("/create")
def create_rfq(payload: dict):
    """
    Body:
    {
      "instrumentId": "<bond_id or micro_bond_id>",  # required
      "userId": "U123",                               # required
      "side": "BUY" | "SELL",                         # required
      "qty": 10000,                                   # required
      "limitPrice": 100.25,                           # optional (None=market)
      "timeInForce": "GTC"|"AON"|"IOC",               # optional (default GTC)
      "autoStartWindow": true,                        # optional
      "windowSeconds": 180,                           # optional if autoStartWindow
      "isin": "IN123...",                             # optional if autoStartWindow
      "lpStub": "LP1",                                # optional if autoStartWindow
      "bandOverride": null                            # optional
    }
    """
    instrument_id = payload.get("instrumentId")
    if not instrument_id:
        raise HTTPException(status_code=400, detail="instrumentId is required")

    user_id = payload.get("userId")
    side = (payload.get("side") or "").upper()
    qty = payload.get("qty")
    limit_price = payload.get("limitPrice", None)
    tif = payload.get("timeInForce", "GTC")

    if not user_id or side not in ("BUY", "SELL") or not qty or qty <= 0:
        raise HTTPException(status_code=400, detail="Invalid RFQ: userId, side (BUY/SELL), qty>0 required")

    # Resolve instrument (parent/micro)
    ids = resolve_instrument(instrument_id)
    parent = ids["parent"]
    micro = ids["micro"]

    # Ensure an OPEN auction exists OR create one if asked
    auction_id = find_open_auction_for_instrument(instrument_id)
    if not auction_id:
        auto = bool(payload.get("autoStartWindow"))
        if not auto:
            raise HTTPException(
                status_code=400,
                detail="No open auction for instrument. Pass autoStartWindow=true with isin/lpStub/windowSeconds to start one."
            )
        isin = payload.get("isin") or f"{parent['name'][:4].upper()}-DEMO"
        lpStub = payload.get("lpStub") or "LP-DEMO"
        windowSeconds = int(payload.get("windowSeconds") or 180)
        bandOverride = payload.get("bandOverride", None)
        auction_id = create_auction_inline(
            instrument_id,
            isin=isin,
            lpStub=lpStub,
            windowSeconds=windowSeconds,
            bandOverride=bandOverride
        )

    # Build fair-price stub (can be replaced by ML)
    fair_stub = fair_price_stub(parent, {"side": side, "qty": qty, "micro": bool(micro)})

    # Build RFQ dict + store globally and attach to auction orders
    rfq_obj = build_rfq_dict(
        auctionId=auction_id,
        instrumentId=instrument_id,
        userId=user_id,
        side=side,
        qty=qty,
        limitPrice=limit_price,
        timeInForce=tif,
        parentId=parent["id"],
        microId=micro["id"] if micro else None,
        fair_stub=fair_stub
    )

    rfqs[rfq_obj["id"]] = rfq_obj

    # Attach to auction orders list
    a = auctions.get(auction_id)
    if not a or a.get("status") != "OPEN":
        raise HTTPException(status_code=400, detail="Auction not open (race condition)")
    a["orders"].append(rfq_obj)

    add_audit("RFQ_CREATED", {"rfqId": rfq_obj["id"], "auctionId": auction_id, "instrumentId": instrument_id}, auction_id)
    return rfq_obj

# -----------------------------
# 2) Get RFQ by ID
# -----------------------------
@router.get("/{rfq_id}")
def get_rfq(rfq_id: str):
    obj = rfqs.get(rfq_id)
    if not obj:
        raise HTTPException(status_code=404, detail="RFQ not found")
    return obj

# -----------------------------
# 3) Cancel RFQ (only while auction OPEN & RFQ OPEN)
# -----------------------------
@router.post("/{rfq_id}/cancel")
def cancel_rfq(rfq_id: str):
    obj = rfqs.get(rfq_id)
    if not obj:
        raise HTTPException(status_code=404, detail="RFQ not found")

    auction_id = obj["auctionId"]
    a = auctions.get(auction_id)
    if not a:
        raise HTTPException(status_code=404, detail="Auction not found")
    if a["status"] != "OPEN":
        raise HTTPException(status_code=400, detail="Auction already closed")

    if obj["status"] not in ("OPEN",):
        raise HTTPException(status_code=400, detail=f"RFQ not cancellable in status {obj['status']}")

    obj["status"] = "CANCELLED"
    obj["ts_cancelled"] = now_ms()

    # Also mark in auction orders array
    for o in a["orders"]:
        if o["id"] == rfq_id:
            o["status"] = "CANCELLED"
            break

    add_audit("RFQ_CANCELLED", {"rfqId": rfq_id, "auctionId": auction_id}, auction_id)
    return {"success": True, "rfq": obj}

# -----------------------------
# 4) Modify RFQ (qty/limitPrice) before close
# -----------------------------
@router.post("/{rfq_id}/modify")
def modify_rfq(rfq_id: str, payload: dict):
    """
    Body: { "qty": <float>, "limitPrice": <float|null> }
    """
    obj = rfqs.get(rfq_id)
    if not obj:
        raise HTTPException(status_code=404, detail="RFQ not found")

    auction_id = obj["auctionId"]
    a = auctions.get(auction_id)
    if not a:
        raise HTTPException(status_code=404, detail="Auction not found")
    if a["status"] != "OPEN":
        raise HTTPException(status_code=400, detail="Auction already closed")

    if obj["status"] != "OPEN":
        raise HTTPException(status_code=400, detail=f"RFQ not modifiable in status {obj['status']}")

    new_qty = payload.get("qty", obj["qty"])
    new_lp = payload.get("limitPrice", obj["limitPrice"])

    if new_qty <= 0:
        raise HTTPException(status_code=400, detail="qty must be > 0")

    obj["qty"] = float(new_qty)
    obj["limitPrice"] = new_lp
    obj["ts_modified"] = now_ms()

    # Also patch in auction orders array
    for o in a["orders"]:
        if o["id"] == rfq_id:
            o["qty"] = obj["qty"]
            o["limitPrice"] = obj["limitPrice"]
            o["ts_modified"] = obj["ts_modified"]
            break

    add_audit("RFQ_MODIFIED", {"rfqId": rfq_id, "auctionId": auction_id, "qty": obj["qty"], "limitPrice": obj["limitPrice"]}, auction_id)
    return {"success": True, "rfq": obj}

# -----------------------------
# 5) List RFQs (filters)
# -----------------------------
@router.get("/list")
def list_rfqs(
    userId: Optional[str] = None,
    status: Optional[str] = None,
    instrumentId: Optional[str] = None,
    auctionId: Optional[str] = None,
    limit: int = Query(200, ge=1, le=1000)
):
    res: List[Dict[str, Any]] = list(rfqs.values())
    if userId:
        res = [r for r in res if r.get("userId") == userId]
    if status:
        res = [r for r in res if r.get("status") == status]
    if instrumentId:
        res = [r for r in res if r.get("instrumentId") == instrumentId]
    if auctionId:
        res = [r for r in res if r.get("auctionId") == auctionId]
    res.sort(key=lambda x: x.get("ts", 0), reverse=True)
    return res[:limit]

# -----------------------------
# 6) List Orders in an Auction
# -----------------------------
@router.get("/auction/{auction_id}/orders")
def list_orders_in_auction(auction_id: str, userId: Optional[str] = None):
    a = auctions.get(auction_id)
    if not a:
        raise HTTPException(status_code=404, detail="Auction not found")
    orders = a.get("orders", [])
    if userId:
        orders = [o for o in orders if o.get("userId") == userId]
    return orders

# -----------------------------
# 7) Attach/Update Fair Price to an RFQ (from ML or stub)
# -----------------------------
@router.patch("/{rfq_id}/fairprice")
def patch_fair_price(rfq_id: str, payload: dict):
    """
    Body: { "fairPrice": float, "bandLow": float, "bandHigh": float, "explanation": str }
    Any missing field will be left as-is.
    """
    obj = rfqs.get(rfq_id)
    if not obj:
        raise HTTPException(status_code=404, detail="RFQ not found")

    for k in ("fairPrice", "bandLow", "bandHigh", "explanation"):
        if k in payload:
            obj[k] = payload[k]

    # Mirror to auction orders
    a = auctions.get(obj["auctionId"])
    if a:
        for o in a.get("orders", []):
            if o["id"] == rfq_id:
                for k in ("fairPrice", "bandLow", "bandHigh", "explanation"):
                    if k in payload:
                        o[k] = payload[k]
                break

    add_audit("RFQ_FAIRPRICE_UPDATE", {"rfqId": rfq_id, **{k: obj.get(k) for k in ("fairPrice","bandLow","bandHigh")}}, obj["auctionId"])
    return {"success": True, "rfq": obj}

# -----------------------------
# 8) Generate/Refresh Fair Price via Stub (helper)
# -----------------------------
@router.post("/{rfq_id}/price/stub")
def refresh_fair_price_stub(rfq_id: str):
    obj = rfqs.get(rfq_id)
    if not obj:
        raise HTTPException(status_code=404, detail="RFQ not found")

    ids = resolve_instrument(obj["instrumentId"])
    parent = ids["parent"]
    micro = ids["micro"]
    stub = fair_price_stub(parent, {"side": obj["side"], "qty": obj["qty"], "micro": bool(micro)})

    obj["fairPrice"] = stub["fairPrice"]
    obj["bandLow"] = stub["bandLow"]
    obj["bandHigh"] = stub["bandHigh"]
    obj["explanation"] = stub["explanation"]

    # Mirror to auction orders
    a = auctions.get(obj["auctionId"])
    if a:
        for o in a.get("orders", []):
            if o["id"] == rfq_id:
                o["fairPrice"] = obj["fairPrice"]
                o["bandLow"] = obj["bandLow"]
                o["bandHigh"] = obj["bandHigh"]
                o["explanation"] = obj["explanation"]
                break

    add_audit("RFQ_FAIRPRICE_STUB", {"rfqId": rfq_id, **stub}, obj["auctionId"])
    return {"success": True, "rfq": obj}

# -----------------------------
# 9) Dealer Quote endpoints (optional bulletin-board RFQ)
# -----------------------------
@router.post("/{rfq_id}/quote")
def add_quote(rfq_id: str, quote: dict):
    """
    Body: { "dealer": "LP1", "price": 100.1 }
    """
    obj = rfqs.get(rfq_id)
    if not obj:
        raise HTTPException(status_code=404, detail="RFQ not found")
    if obj["status"] != "OPEN":
        raise HTTPException(status_code=400, detail=f"RFQ not open (status={obj['status']})")

    dealer = quote.get("dealer")
    price = quote.get("price")
    if not dealer or price is None:
        raise HTTPException(status_code=400, detail="dealer and price required")

    q = {"dealer": dealer, "price": float(price), "timestamp": time.time()}
    obj["quotes"].append(q)
    add_audit("RFQ_QUOTE_ADDED", {"rfqId": rfq_id, "dealer": dealer, "price": price}, obj["auctionId"])
    return obj

@router.post("/{rfq_id}/accept")
def accept_quote(rfq_id: str, body: dict):
    """
    Body: { "dealer": "LP1" }
    Marks acceptedQuote (for demo UX). Execution still happens at auction clear.
    """
    obj = rfqs.get(rfq_id)
    if not obj:
        raise HTTPException(status_code=404, detail="RFQ not found")
    dealer = body.get("dealer")
    if not dealer:
        raise HTTPException(status_code=400, detail="dealer required")
    found = next((q for q in obj.get("quotes", []) if q["dealer"] == dealer), None)
    if not found:
        raise HTTPException(status_code=404, detail="quote from dealer not found")
    obj["acceptedQuote"] = found
    add_audit("RFQ_QUOTE_ACCEPTED", {"rfqId": rfq_id, "dealer": dealer}, obj["auctionId"])
    return obj
