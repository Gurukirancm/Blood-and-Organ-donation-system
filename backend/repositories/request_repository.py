from typing import List
from models.request import DonationRequest
from repositories.base_repository import BaseRepository

class RequestRepository(BaseRepository[DonationRequest, DonationRequest, DonationRequest]):
    def __init__(self):
        super().__init__("requests", DonationRequest)

    def get_by_urgency(self, urgency: str) -> List[DonationRequest]:
        cursor = self.collection.find({"urgency": urgency})
        return [self.model(**self._serialize(doc)) for doc in cursor]

    def _serialize(self, doc: dict) -> dict:
        from utils.serialization import serialize_doc
        return serialize_doc(doc)
