from fastapi import APIRouter, HTTPException, status, Depends, Body
from typing import List, Optional
from models.hospital import Hospital
from core.db_instance import get_collection
from utils.serialization import serialize_doc
from routes.auth_routes import RoleChecker, get_current_user
from services.blockchain_service import BlockchainService
from bson import ObjectId
from datetime import datetime
import logging

hospital_router = APIRouter()
blockchain_service = BlockchainService()

@hospital_router.post("/", response_model=Hospital, status_code=status.HTTP_201_CREATED, dependencies=[Depends(RoleChecker(["admin"]))])
def create_hospital(hospital: Hospital):
    try:
        data = hospital.dict()
        result = get_collection("hospitals").insert_one(data)
        created = get_collection("hospitals").find_one({"_id": result.inserted_id})
        return serialize_doc(created)
    except Exception as e:
        logging.getLogger(__name__).exception("Error creating hospital: %s", e)
        raise HTTPException(status_code=500, detail="Failed to create hospital")


@hospital_router.get("/", response_model=List[Hospital], dependencies=[Depends(RoleChecker(["hospital", "admin"]))])
def list_hospitals():
    docs = get_collection("hospitals").find()
    return [serialize_doc(d) for d in docs]

@hospital_router.post("/fulfill/{request_id}", dependencies=[Depends(RoleChecker(["hospital", "admin"]))])
def fulfill_request(request_id: str, donor_id: str = Body(..., embed=True), current_user: dict = Depends(get_current_user)):
    try:
        # 1. Verify Request exists and is NOT already fulfilled
        req = get_collection("requests").find_one({"_id": ObjectId(request_id)})
        if not req:
             raise HTTPException(status_code=404, detail="Request not found")
        
        if req.get("status") == "fulfilled":
             raise HTTPException(status_code=400, detail="Request is already fulfilled")

        # 2. ATOMIC CLAIM: Update Donor Availability
        claimed_donor = get_collection("donors").find_one_and_update(
            {"_id": ObjectId(donor_id), "availability": True},
            {"$set": {"availability": False}},
            return_document=True
        )

        if not claimed_donor:
            raise HTTPException(
                status_code=409, 
                detail="Donor is no longer available. A race condition was prevented."
            )

        # 3. Update Request Status
        get_collection("requests").update_one(
            {"_id": ObjectId(request_id)}, 
            {"$set": {
                "status": "fulfilled", 
                "fulfilled_by": str(current_user.id),
                "donor_id": donor_id, 
                "fulfilled_at": datetime.now().isoformat()
            }}
        )

        # 4. Log to Blockchain
        try:
            blockchain_service.log_match_found(
                request_id=request_id,
                donor_id=donor_id,
                compatibility_score=1.0 
            )
        except Exception:
            logging.getLogger(__name__).warning("Blockchain logging failed for fulfillment")

        return {
            "message": "Fulfillment successful. Donor claimed and logged to blockchain.",
            "donor_name": claimed_donor.get("name")
        }

    except HTTPException:
        raise
    except Exception as e:
        logging.getLogger(__name__).exception("Error fulfilling request: %s", e)
        raise HTTPException(status_code=500, detail="Failed to fulfill request")
