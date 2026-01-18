from typing import List, Dict, Any, Optional
from bson import ObjectId

class MockCollection:
    def __init__(self, name: str):
        self.name = name
        self.data: Dict[str, Dict[str, Any]] = {}

    def find_one(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        id_val = query.get("_id")
        if id_val and isinstance(id_val, ObjectId):
            return self.data.get(str(id_val))
        
        for item in self.data.values():
            match = True
            for k, v in query.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                return item
        return None

    def find(self, query: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        if not query:
            return list(self.data.values())
        
        results = []
        for item in self.data.values():
            match = True
            for k, v in query.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                results.append(item)
        return results

    def insert_one(self, document: Dict[str, Any]):
        if "_id" not in document:
            document["_id"] = ObjectId()
        self.data[str(document["_id"])] = document
        return type('obj', (object,), {'inserted_id': document["_id"]})

    def update_one(self, query: Dict[str, Any], update: Dict[str, Any]):
        doc = self.find_one(query)
        if doc and "$set" in update:
            doc.update(update["$set"])
            return type('obj', (object,), {'modified_count': 1})
        return type('obj', (object,), {'modified_count': 0})

    def find_one_and_update(self, query: Dict[str, Any], update: Dict[str, Any], return_document=True):
        doc = self.find_one(query)
        if doc and "$set" in update:
            doc.update(update["$set"])
            return doc
        return None

    def create_index(self, *args, **kwargs):
        pass

    def delete_one(self, query: Dict[str, Any]):
        doc = self.find_one(query)
        if doc:
            del self.data[str(doc["_id"])]
            return type('obj', (object,), {'deleted_count': 1})
        return type('obj', (object,), {'deleted_count': 0})
