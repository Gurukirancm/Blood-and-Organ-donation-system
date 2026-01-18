from sqlmodel import Session
from backend.api.db import engine
from backend.api import crud
from backend.api.blockchain import log_match


def run_test():
    with Session(engine) as session:
        donor = crud.create_donor(session, {
            "name": "Script Donor",
            "age": 28,
            "blood_group": "B+",
            "organ": "liver",
            "phone": "555-0200",
            "location": "Script City",
            "availability": True
        })
        req = crud.create_request(session, {
            "blood_group": "B+",
            "organ": "liver",
            "urgency": "high"
        })
        tx = log_match(session, donor.id, req.id)
        print("Recorded tx id:", tx.id, "tx_hash:", tx.tx_hash)


if __name__ == "__main__":
    run_test()
