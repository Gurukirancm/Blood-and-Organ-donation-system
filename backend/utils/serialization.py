from bson import ObjectId

def serialize_doc(doc: dict) -> dict:
    if not doc:
        return {}
    doc = dict(doc)
    _id = doc.pop("_id", None)
    if isinstance(_id, ObjectId):
        doc["id"] = str(_id)
    else:
        doc["id"] = _id
    return doc
