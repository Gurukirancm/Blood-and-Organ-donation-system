from typing import List, Optional
from models.donor import Donor
from repositories.base_repository import BaseRepository

class DonorRepository(BaseRepository[Donor, Donor, Donor]):
    def __init__(self):
        super().__init__("donors", Donor)

    def get_by_blood_group(self, blood_group: str) -> List[Donor]:
        cursor = self.collection.find({"blood_group": blood_group})
        return [self.model(**self._serialize(doc)) for doc in cursor]
    
    def get_by_organ(self, organ: str) -> List[Donor]:
        cursor = self.collection.find({"organ": organ, "availability": True})
        return [self.model(**self._serialize(doc)) for doc in cursor]

    def get_by_user_id(self, user_id: str) -> Optional[Donor]:
        doc = self.collection.find_one({"user_id": user_id})
        return self.model(**self._serialize(doc)) if doc else None

    def _serialize(self, doc: dict) -> dict:
        from utils.serialization import serialize_doc
        return serialize_doc(doc)
