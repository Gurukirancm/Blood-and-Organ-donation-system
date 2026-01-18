from typing import Optional, List
from repositories.base_repository import BaseRepository
from models.user import User

class UserRepository(BaseRepository[User, User, User]):
    def __init__(self):
        super().__init__("users", User)

    def get_by_email(self, email: str) -> Optional[User]:
        doc = self.collection.find_one({"email": email})
        return self.model(**self._serialize(doc)) if doc else None

    def get_all_users(self) -> List[User]:
        return self.get_multi()

    def update_status(self, user_id: str, is_active: bool) -> bool:
        return self.update(user_id, {"is_active": is_active}) is not None

    def _serialize(self, doc: dict) -> dict:
        from utils.serialization import serialize_doc
        return serialize_doc(doc)
