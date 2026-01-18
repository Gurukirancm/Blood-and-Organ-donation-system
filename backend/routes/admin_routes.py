from fastapi import APIRouter, Depends, HTTPException, status
from services.blockchain_service import BlockchainService
from routes.auth_routes import get_current_user, RoleChecker
from typing import List, Dict, Any
from core.db_instance import get_collection
from utils.serialization import serialize_doc
from pydantic import BaseModel
from repositories.user_repository import UserRepository
from services.donor_service import DonorService

admin_router = APIRouter()
blockchain_service = BlockchainService()
user_repo = UserRepository()
donor_service = DonorService()

@admin_router.get("/audit-trail", response_model=List[Dict[str, Any]], dependencies=[Depends(RoleChecker(["admin"]))])
def get_audit_trail(current_user: Dict = Depends(get_current_user)):
    return blockchain_service.get_full_chain()

@admin_router.get("/integrity-check", dependencies=[Depends(RoleChecker(["admin"]))])
def verify_ledger_integrity(current_user: Dict = Depends(get_current_user)):
    is_valid = blockchain_service.verify_chain()
    return {"integrity": is_valid, "message": "Ledger is valid" if is_valid else "Ledger has been tampered with!"}

@admin_router.get("/users", dependencies=[Depends(RoleChecker(["admin"]))])
def list_users(current_user: Dict = Depends(get_current_user)):
    users = user_repo.get_all_users()
    return [serialize_doc(u) for u in users]

class UserStatusUpdate(BaseModel):
    is_active: bool

@admin_router.patch("/users/{user_id}/status", dependencies=[Depends(RoleChecker(["admin"]))])
def update_user_status(user_id: str, status_update: UserStatusUpdate, current_user: Dict = Depends(get_current_user)):
    success = user_repo.update_status(user_id, status_update.is_active)
    if not success:
        raise HTTPException(status_code=404, detail="User not found or update failed")
    return {"message": "User status updated"}

@admin_router.get("/inventory", dependencies=[Depends(RoleChecker(["admin"]))])
def get_inventory(current_user: Dict = Depends(get_current_user)):
    donors = donor_service.get_all_donors()
    hospitals = list(get_collection("hospitals").find())
    
    blood_inventory = {}
    organ_inventory = {}
    
    for d in donors:
        if d.availability:
            bg = d.blood_group
            blood_inventory[bg] = blood_inventory.get(bg, 0) + 1
            org = d.organ
            organ_inventory[org] = organ_inventory.get(org, 0) + 1
            
    return {
        "blood": blood_inventory,
        "organs": organ_inventory,
        "total_hospitals": len(hospitals),
        "total_donors": len(donors)
    }
