from fastapi import APIRouter, Depends
from routes.auth_routes import RoleChecker
from services.donor_service import DonorService
import logging

analysis_router = APIRouter()
donor_service = DonorService()

@analysis_router.get("/availability", dependencies=[Depends(RoleChecker(["recipient", "hospital", "admin"]))])
def get_anonymized_availability():
    """
    Returns aggregate counts of available blood and organs.
    No personal info (names/IDs) is leaked.
    """
    try:
        donors = donor_service.get_all_donors()
        
        blood_counts = {}
        organ_counts = {}
        
        for d in donors:
            if d.availability:
                # Aggregate Blood
                bg = d.blood_group
                blood_counts[bg] = blood_counts.get(bg, 0) + 1
                
                # Aggregate Organ
                org = d.organ
                organ_counts[org] = organ_counts.get(org, 0) + 1
                
        return {
            "blood_inventory": blood_counts,
            "organ_inventory": organ_counts,
            "total_available_units": sum(blood_counts.values()) + sum(organ_counts.values())
        }
    except Exception as e:
        logging.getLogger(__name__).error(f"Error in analysis: {e}")
        return {"error": "Failed to fetch availability analysis"}
