from typing import Dict, Any
from ledger.local_ledger import LocalLedger

class BlockchainService:
    def __init__(self):
        self.ledger = LocalLedger()

    def log_donor_registration(self, donor_id: str, donor_name: str, blood_group: str) -> Dict:
        """Log donor registration event."""
        data = {
            "event_type": "DONOR_REGISTRATION",
            "entity_type": "Donor",
            "entity_id": donor_id,
            "action": "registered",
            "details": {
                "donor_name": donor_name,
                "blood_group": blood_group,
            }
        }
        return self.ledger.append_entry(data)

    def log_hospital_request(self, request_id: str, hospital_id: str, urgency: str, organ: str) -> Dict:
        """Log hospital donation request."""
        data = {
            "event_type": "HOSPITAL_REQUEST",
            "entity_type": "Request",
            "entity_id": request_id,
            "action": "created",
            "details": {
                "hospital_id": hospital_id,
                "urgency": urgency,
                "organ": organ,
            }
        }
        return self.ledger.append_entry(data)

    def log_match_found(self, request_id: str, donor_id: str, compatibility_score: float) -> Dict:
        """Log matching found event."""
        data = {
            "event_type": "MATCH_FOUND",
            "entity_type": "Request",
            "entity_id": request_id,
            "action": "matched",
            "details": {
                "donor_id": donor_id,
                "compatibility_score": compatibility_score,
            }
        }
        return self.ledger.append_entry(data)

    def verify_chain(self) -> bool:
        return self.ledger.verify_integrity()

    def get_full_chain(self) -> list:
        return self.ledger.chain
