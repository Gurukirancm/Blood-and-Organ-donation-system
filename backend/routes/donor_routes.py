from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from models.donor import Donor
from services.donor_service import DonorService
from routes.auth_routes import RoleChecker, get_current_user
import logging

donor_router = APIRouter()

def get_donor_service():
    return DonorService()

@donor_router.post("/", response_model=Donor, status_code=status.HTTP_201_CREATED, dependencies=[Depends(RoleChecker(["donor", "admin"]))])
def create_donor(donor: Donor, current_user: dict = Depends(get_current_user), service: DonorService = Depends(get_donor_service)):
    try:
        # Enforce user linkage
        if current_user.role == "donor":
             donor.user_id = str(current_user.id)
        return service.create_donor(donor)
    except Exception as e:
        logging.getLogger(__name__).exception("Error creating donor: %s", e)
        raise HTTPException(status_code=500, detail="Failed to create donor")

@donor_router.get("/me", response_model=Donor, dependencies=[Depends(RoleChecker(["donor"]))])
def get_my_profile(current_user: dict = Depends(get_current_user), service: DonorService = Depends(get_donor_service)):
    profile = service.get_donor_profile(str(current_user.id))
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found. Please register.")
    return profile

@donor_router.put("/me", response_model=Donor, dependencies=[Depends(RoleChecker(["donor"]))])
def update_my_profile(donor: Donor, current_user: dict = Depends(get_current_user), service: DonorService = Depends(get_donor_service)):
    updated = service.update_donor_profile(str(current_user.id), donor.dict(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Profile not found")
    return updated

@donor_router.get("/history", dependencies=[Depends(RoleChecker(["donor"]))])
def get_my_history(current_user: dict = Depends(get_current_user), service: DonorService = Depends(get_donor_service)):
    return service.get_donation_history(str(current_user.id))

@donor_router.get("/", response_model=List[Donor], dependencies=[Depends(RoleChecker(["hospital", "admin"]))])
def list_donors(service: DonorService = Depends(get_donor_service)):
    return service.get_all_donors()
