from fastapi import APIRouter
import state

router = APIRouter()

@router.get("/ping")
def ping():
    return {"status": "ok"}

@router.get("/stats")
def stats():
    return {
        "bonds": len(state.bonds),
        "auctions": len(state.auctions),
        "orders": len(state.orders),
        "fills": len(state.fills),
        "audit_events": len(state.audit_events),
    }
