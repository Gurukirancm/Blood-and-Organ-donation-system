from typing import List
from models.request import DonationRequest
from models.donor import Donor
from core.db_instance import get_collection
from utils.serialization import serialize_doc


def match_donors(req: DonationRequest, max_results: int = 10) -> List[dict]:
    """Simple rule-based matching engine."""
    query = {"organ": req.organ}
    if getattr(req, "blood_group", None):
        query["blood_group"] = req.blood_group

    cursor = get_collection("donors").find(query).sort("last_donation", -1).limit(max_results)
    return [serialize_doc(d) for d in cursor]
