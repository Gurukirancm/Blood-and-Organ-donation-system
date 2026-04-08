from fastapi import APIRouter, Depends, HTTPException, status, Body
from services.blockchain_service import BlockchainService
from routes.auth_routes import get_current_user, RoleChecker
from typing import List, Dict, Any
from core.db_instance import get_collection
from utils.serialization import serialize_doc
from pydantic import BaseModel
from repositories.user_repository import UserRepository
from services.donor_service import DonorService
from services.matching_service import MatchingService

admin_router = APIRouter()
blockchain_service = BlockchainService()
user_repo = UserRepository()
donor_service = DonorService()
matching_service = MatchingService()

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
    hospitals = hospital_repo.get_multi()
    
    blood_inventory = {}
    organ_inventory = {}
    
    for d in donors:
        if d.availability:
            bg = d.blood_group
            blood_inventory[bg] = blood_inventory.get(bg, 0) + 1
            # Handle plural organs list
            for org in d.organs:
                organ_inventory[org] = organ_inventory.get(org, 0) + 1
            
    return {
        "blood": blood_inventory,
        "organs": organ_inventory,
        "total_hospitals": len(hospitals),
        "total_donors": len(donors)
    }

# Hospital Management
from models.hospital import HospitalCreate, Hospital
from services.auth_service import AuthService
from repositories.repository import RepositoryFactory

auth_service = AuthService()
hospital_repo = RepositoryFactory.get_hospital_repository()

@admin_router.get("/hospitals", dependencies=[Depends(RoleChecker(["admin"]))])
def list_hospitals(current_user: Dict = Depends(get_current_user)):
    hospitals = hospital_repo.get_multi()
    return [serialize_doc(h.dict() if hasattr(h, 'dict') else h) for h in hospitals]

@admin_router.post("/hospitals", status_code=status.HTTP_201_CREATED, dependencies=[Depends(RoleChecker(["admin"]))])
def create_hospital(hospital_data: HospitalCreate, current_user: Dict = Depends(get_current_user)):
    # 1. Create User
    try:
        user = auth_service.register_user(hospital_data.email, hospital_data.password, "hospital")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # 2. Create Hospital Profile
    # The repository expectation is a model, but BaseRepository.create takes CreateSchemaType
    # HospitalCreate has password, but Hospital model does not.
    # We should exclude password before creating the profile.
    hospital_dict = hospital_data.dict(exclude={"password"})
    from models.hospital import Hospital as HospitalModel
    created_hospital = hospital_repo.create(HospitalModel(**hospital_dict))
    
    return serialize_doc(created_hospital.dict())

@admin_router.delete("/hospitals/{hospital_id}", dependencies=[Depends(RoleChecker(["admin"]))])
def delete_hospital(hospital_id: str, current_user: Dict = Depends(get_current_user)):
    # 1. Get hospital to find email
    hospital = hospital_repo.get(hospital_id)
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")
    
    # 2. Delete User (Optional: if we want to remove login access)
    # user_repo.delete_by_email(hospital.email) 
    
    # 3. Delete Hospital Profile
    success = hospital_repo.delete(hospital_id)
    if not success:
        raise HTTPException(status_code=404, detail="Hospital not found")
        
    return {"message": "Hospital deleted successfully"}

@admin_router.patch("/hospitals/{hospital_id}/approve", dependencies=[Depends(RoleChecker(["admin"]))])
def approve_hospital(hospital_id: str, is_active: bool, current_user: Dict = Depends(get_current_user)):
    # Update Hospital Profile
    hospital = hospital_repo.update(hospital_id, {"is_active": is_active})
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")
    
    # Update User Login Status
    user = user_repo.get_by_email(hospital.email)
    if user:
        user_repo.update_status(user.id, is_active)
        
    return {"message": f"Hospital {'approved' if is_active else 'rejected'}"}


# Donor Management

donor_repo = RepositoryFactory.get_donor_repository()

@admin_router.get("/donors", dependencies=[Depends(RoleChecker(["admin"]))])
def list_donors(current_user: Dict = Depends(get_current_user)):
    donors = donor_repo.get_all()
    # Optional: Merge with User data if needed, but Donor profile usually has enough info
    return [serialize_doc(d) for d in donors]

@admin_router.put("/donors/{donor_id}", dependencies=[Depends(RoleChecker(["admin"]))])
def update_donor(donor_id: str, updates: Dict[str, Any], current_user: Dict = Depends(get_current_user)):
    # Prevent updating critical fields like ID or UserID arbitrarily
    safe_updates = {k: v for k, v in updates.items() if k not in ["id", "user_id", "created_at"]}
    updated_donor = donor_repo.update(donor_id, safe_updates)
    if not updated_donor:
        raise HTTPException(status_code=404, detail="Donor not found")
    return serialize_doc(updated_donor)

@admin_router.delete("/donors/{donor_id}", dependencies=[Depends(RoleChecker(["admin"]))])
def delete_donor(donor_id: str, current_user: Dict = Depends(get_current_user)):
    donor = donor_repo.get_by_id(donor_id)
    if not donor:
        raise HTTPException(status_code=404, detail="Donor not found")
        
    # Delete User Account
    if "user_id" in donor:
         # Assuming user_repo has delete method, if not we add one or just deactivate
         # user_repo.delete(donor['user_id']) # Ensure repo supports this
         pass

    success = donor_repo.delete(donor_id)
    if not success:
        raise HTTPException(status_code=404, detail="Donor delete failed")
    return {"message": "Donor deleted successfully"}

@admin_router.patch("/donors/{donor_id}/verify", dependencies=[Depends(RoleChecker(["admin"]))])
def verify_donor(donor_id: str, is_verified: bool, current_user: Dict = Depends(get_current_user)):
    donor = donor_repo.update(donor_id, {"is_verified": is_verified})
    if not donor:
        raise HTTPException(status_code=404, detail="Donor not found")
    return {"message": f"Donor {'verified' if is_verified else 'unverified'}"}


# Request Management

request_repo = RepositoryFactory.get_request_repository()

@admin_router.get("/requests", dependencies=[Depends(RoleChecker(["admin"]))])
def list_requests(current_user: Dict = Depends(get_current_user)):
    requests = request_repo.get_all()
    return [serialize_doc(r) for r in requests]

@admin_router.patch("/requests/{request_id}/status", dependencies=[Depends(RoleChecker(["admin"]))])
def update_request_status(request_id: str, status: str, current_user: Dict = Depends(get_current_user)):
    # Valid statuses: pending, approved, rejected, completed, cancelled
    updated_req = request_repo.update_status(request_id, status)
    if not updated_req:
        raise HTTPException(status_code=404, detail="Request not found")
    return serialize_doc(updated_req)

@admin_router.get("/requests/{request_id}/ai-matches", dependencies=[Depends(RoleChecker(["admin"]))])
def get_ai_matches(request_id: str, current_user: Dict = Depends(get_current_user)):
    try:
        matches = matching_service.find_matches_for_request(request_id)
        return matches
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Matching service error")

@admin_router.patch("/requests/{request_id}/assign", dependencies=[Depends(RoleChecker(["admin"]))])
def assign_donor(request_id: str, donor_id: str, current_user: Dict = Depends(get_current_user)):
    # Check if donor exists
    donor = donor_repo.get_by_id(donor_id)
    if not donor:
         raise HTTPException(status_code=404, detail="Donor not found")
         
    updates = {
        "status": "matched",
        "matched_donor_id": donor_id,
        "matched_donor_name": f"{donor.get('first_name','')} {donor.get('last_name','')}".strip()
    }
    updated_req = request_repo.update(request_id, updates)
    if not updated_req:
        raise HTTPException(status_code=404, detail="Request not found")
        
    # Notify Donor (Future: Add notification service call)
    
    return serialize_doc(updated_req)

@admin_router.post("/emergency/broadcast", dependencies=[Depends(RoleChecker(["admin"]))])
def emergency_broadcast(message: str = Body(..., embed=True), current_user: Dict = Depends(get_current_user)):
    # In a real system, this would trigger SMS/Email/Push notifications
    # For now, we'll just log it or add to a system notification collection
    from services.notification_service import NotificationService
    # notification_service.broadcast(message) # Hypothetical
    return {"message": "Emergency broadcast sent", "content": message}

