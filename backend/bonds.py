from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from uuid import uuid4
import state

router = APIRouter()

@router.get("/")
def get_bonds():
    return state.bonds

class BondCreate(BaseModel):
    name: str
    faceValue: float = Field(gt=0)

@router.post("/create")
def create_bond(req: BondCreate):
    bond_id = str(uuid4())
    state.bonds[bond_id] = {
        "id": bond_id,
        "name": req.name,
        "faceValue": req.faceValue,
        "microBonds": [],
        "status": "active"
    }
    return {"success": True, "bond": state.bonds[bond_id]}

@router.post("/split/{bond_id}")
def split_bond(bond_id: str, parts: int):
    if bond_id not in state.bonds:
        raise HTTPException(status_code=404, detail="Bond not found")
    if parts <= 0:
        raise HTTPException(status_code=400, detail="parts must be > 0")

    parent = state.bonds[bond_id]
    unit_value = parent["faceValue"] / parts
    parent["microBonds"] = []
    for _ in range(parts):
        mid = str(uuid4())
        parent["microBonds"].append({
            "id": mid,
            "parentId": bond_id,
            "value": unit_value,
            "status": "available",
        })
    parent["status"] = "split"
    return {"parentBond": bond_id, "microBonds": parent["microBonds"]}
