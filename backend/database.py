from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.errors import ServerSelectionTimeoutError
import logging
from core.config import settings

MONGO_URL = settings.MONGO_URL
# set a reasonable server selection timeout so startup doesn't hang too long
client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=5000)

from core.db_instance import set_collection, get_collection

def init_db() -> None:
    """Initialize DB instances and indexes. 
    Switches to MOCK collections if MongoDB is unreachable.
    """
    try:
        # quick ping to verify server availability
        client.admin.command("ping")
        logging.getLogger(__name__).info("MongoDB connection successful. Using persistent storage.")
        
        # Real Collections
        set_collection("donors", client[settings.DB_NAME]["donors"])
        set_collection("hospitals", client[settings.DB_NAME]["hospitals"])
        set_collection("requests", client[settings.DB_NAME]["requests"])
        set_collection("users", client[settings.DB_NAME]["users"])
        
        # Initialize Indexes
        get_collection("donors").create_index("blood_group")
        get_collection("donors").create_index([("organ", 1), ("location", 1)])
        get_collection("hospitals").create_index("city")
        get_collection("requests").create_index("urgency")
        get_collection("requests").create_index("organ")
        
    except (ServerSelectionTimeoutError, Exception) as e:
        logging.getLogger(__name__).warning(f"!!! DATABASE FAILOVER !!! MongoDB unavailable: {e}. Switching to IN-MEMORY MOCK MODE for demonstration.")
        from utils.mock_db import MockCollection
        set_collection("donors", MockCollection("donors"))
        set_collection("hospitals", MockCollection("hospitals") )
        set_collection("requests", MockCollection("requests"))
        set_collection("users", MockCollection("users"))
        
        # Seed Mock Users for Demo
        from services.auth_service import AuthService
        auth = AuthService()
        
        u_coll = get_collection("users")
        u_coll.insert_one({"email": "admin@test.com", "password_hash": auth.get_password_hash("password123"), "role": "admin", "is_active": True})
        u_coll.insert_one({"email": "hospital@test.com", "password_hash": auth.get_password_hash("password123"), "role": "hospital", "is_active": True})
        u_coll.insert_one({"email": "donor@test.com", "password_hash": auth.get_password_hash("password123"), "role": "donor", "is_active": True})
        u_coll.insert_one({"email": "recipient@test.com", "password_hash": auth.get_password_hash("password123"), "role": "recipient", "is_active": True})
        
        get_collection("hospitals").insert_one({"name": "City General Hospital", "location": "Mumbai", "city": "Mumbai"})
        logging.getLogger(__name__).info("Mock Mode initialized with test credentials (password123)")

