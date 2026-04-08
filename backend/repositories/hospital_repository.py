from typing import List, Optional
from models.hospital import Hospital
from repositories.base_repository import BaseRepository

class HospitalRepository(BaseRepository[Hospital, Hospital, Hospital]):
    def __init__(self):
        super().__init__("hospitals", Hospital)

    def get_by_email(self, email: str) -> Optional[Hospital]:
        doc = self.collection.find_one({"email": email})
        return self.model(**self._serialize(doc)) if doc else None

    def _serialize(self, doc: dict) -> dict:
        from utils.serialization import serialize_doc
        return serialize_doc(doc)
