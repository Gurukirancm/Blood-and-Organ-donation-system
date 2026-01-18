import json
from sqlmodel import Session, select
from backend.api.db import engine
from backend.api import models

LEDGER_PATH = "backend/blockchain/mock_chain.json"


def show_ledger():
    try:
        with open(LEDGER_PATH, "r", encoding="utf-8") as fh:
            data = json.load(fh)
        print("Mock ledger contents:")
        print(json.dumps(data, indent=2))
    except FileNotFoundError:
        print(f"Ledger not found at {LEDGER_PATH}")


def show_db():
    print("\nBlockchainTransaction rows in DB:")
    with Session(engine) as session:
        rows = session.exec(select(models.BlockchainTransaction)).all()
        for r in rows:
            print(f"id={r.id} donor_hash={r.donor_hash} request_hash={r.request_hash} tx_hash={r.tx_hash} timestamp={r.timestamp}")


if __name__ == "__main__":
    show_ledger()
    show_db()
