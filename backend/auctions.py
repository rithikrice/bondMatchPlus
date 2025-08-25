from fastapi import APIRouter, HTTPException, BackgroundTasks
from state import bonds, auctions, orders, fills, audit_events
from uuid import uuid4
import time
import threading
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class AuctionStartRequest(BaseModel):
    isin: str
    lpStub: str
    windowSeconds: int
    bandOverride: Optional[float] = None


def now_ms() -> int:
    return int(time.time() * 1000)

def add_audit(event_type: str, payload: dict, auction_id: str = None):
    audit_events.append({
        "t": now_ms(),
        "type": event_type,
        "auctionId": auction_id,
        "payload": payload
    })

def run_auction_timer(auction_id: str):
    """Background timer that closes auction after window"""
    auction = auctions.get(auction_id)
    if not auction:
        return
    duration = (auction["tCloseMs"] - auction["tOpenMs"]) / 1000

    def close_after():
        time.sleep(duration)
        if auction_id in auctions and auctions[auction_id]["status"] == "OPEN":
            auctions[auction_id]["status"] = "CLOSED"
            add_audit("AUCTION_AUTO_CLOSE", {"auctionId": auction_id}, auction_id)

    threading.Thread(target=close_after, daemon=True).start()

# -----------------------------
# Start Auction
# -----------------------------
@router.post("/start/{instrument_id}")
async def start_auction(instrument_id: str, req: AuctionStartRequest, background_tasks: BackgroundTasks):
    # 1. Check if instrument exists (parent or microBond)
    parent = None
    micro = None
    for b in bonds.values():
        if b["id"] == instrument_id:
            parent = b
        else:
            for mb in b.get("microBonds", []):
                if mb["id"] == instrument_id:
                    parent = b
                    micro = mb
                    break

    if not parent:
        raise HTTPException(status_code=404, detail="Bond/microBond not found")

    # 2. Create auction object
    auction_id = str(uuid4())
    auctions[auction_id] = {
        "id": auction_id,
        "instrumentId": instrument_id,
        "meta": {
            "parentId": parent["id"],
            "faceValue": parent["faceValue"],
            "isin": req.isin,
            "lpStub": req.lpStub,
        },
        "orders": [],
        "status": "OPEN",
        "tOpenMs": now_ms(),
        "tCloseMs": now_ms() + req.windowSeconds * 1000,
        "bandOverride": req.bandOverride,
        "band": None,
        "fills": [],
        "clearingPrice": None,
        "matchedNotional": None,
        "merkleRoot": None,
    }

    # 3. Audit
    add_audit("AUCTION_START", {"auctionId": auction_id, "instrumentId": instrument_id}, auction_id)

    # 4. Launch background timer
    background_tasks.add_task(run_auction_timer, auction_id)

    return {"success": True, "auctionId": auction_id, "instrumentId": instrument_id}





# -----------------------------
# Get Auction State
# -----------------------------
@router.get("/{auction_id}")
async def get_auction_state(auction_id: str):
    auction = auctions.get(auction_id)
    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")
    return auction


# -----------------------------
# Get All Auctions (optional helper)
# -----------------------------
@router.get("/allAuctions")
async def list_auctions():
    return list(auctions.values())


# -----------------------------
# Get Auction Result (after close)
# -----------------------------
@router.get("/{auction_id}/result")
async def get_auction_result(auction_id: str):
    auction = auctions.get(auction_id)
    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")

    if auction["status"] != "CLOSED":
        raise HTTPException(status_code=400, detail="Auction still open")

    return {
        "auctionId": auction["id"],
        "status": auction["status"],
        "clearingPrice": auction["clearingPrice"],
        "matchedNotional": auction["matchedNotional"],
        "fills": auction["fills"],
        "merkleRoot": auction["merkleRoot"],
    }


# -----------------------------
# Get Auction Audit Trail
# -----------------------------
@router.get("/{auction_id}/audit")
async def get_auction_audit(auction_id: str):
    # filter audit events for this auction
    related = [e for e in audit_events if e.get("auctionId") == auction_id]
    if not related:
        raise HTTPException(status_code=404, detail="No audit events for this auction")
    return related

