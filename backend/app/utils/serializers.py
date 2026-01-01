def serialize_mongo_doc(doc: dict):
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc
