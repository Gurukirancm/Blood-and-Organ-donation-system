from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union
from pydantic import BaseModel
from pymongo.collection import Collection
from bson import ObjectId
from utils.serialization import serialize_doc

ModelType = TypeVar("ModelType", bound=BaseModel)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

class BaseRepository(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, collection_name: str, model: Type[ModelType]):
        self.collection_name = collection_name
        self.model = model

    @property
    def collection(self) -> Collection:
        from core.db_instance import get_collection
        return get_collection(self.collection_name)

    def get(self, id: Any) -> Optional[ModelType]:
        if isinstance(id, str):
            try:
                id = ObjectId(id)
            except Exception:
                pass
        doc = self.collection.find_one({"_id": id})
        if doc:
            return self.model(**serialize_doc(doc))
        return None

    def get_multi(self, skip: int = 0, limit: int = 100, filter_query: Optional[Dict[str, Any]] = None) -> List[ModelType]:
        query = filter_query or {}
        cursor = self.collection.find(query).skip(skip).limit(limit)
        return [self.model(**serialize_doc(doc)) for doc in cursor]

    def create(self, obj_in: CreateSchemaType) -> ModelType:
        obj_in_data = obj_in.dict()
        result = self.collection.insert_one(obj_in_data)
        created_doc = self.collection.find_one({"_id": result.inserted_id})
        return self.model(**serialize_doc(created_doc))

    def update(
        self, id: Any, obj_in: Union[UpdateSchemaType, Dict[str, Any]]
    ) -> Optional[ModelType]:
        if isinstance(id, str):
            try:
                id = ObjectId(id)
            except Exception:
                pass
        
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)

        self.collection.update_one({"_id": id}, {"$set": update_data})
        updated_doc = self.collection.find_one({"_id": id})
        if updated_doc:
            return self.model(**serialize_doc(updated_doc))
        return None

    def delete(self, id: Any) -> bool:
        if isinstance(id, str):
            try:
                id = ObjectId(id)
            except Exception:
                pass
        result = self.collection.delete_one({"_id": id})
        return result.deleted_count > 0
