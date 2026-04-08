from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.errors import ServerSelectionTimeoutError
import logging
from datetime import datetime, timedelta
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
        set_collection("notifications", MockCollection("notifications"))
        
        # No longer seeding test users for real-world mode.
        # Users must register themselves.
        logging.getLogger(__name__).info("Mock Mode initialized.")
        
        # Seed default users for Mock Mode
        try:
            
            # STARTUP SEEDING (Clean Slate)
            users_col = get_collection("users")
            donors_col = get_collection("donors")
            requests_col = get_collection("requests")
            hospitals_col = get_collection("hospitals")
            notifications_col = get_collection("notifications")

            # 1. WIPE ALL DATA
            users_col.delete_many({})
            donors_col.delete_many({})
            requests_col.delete_many({})
            hospitals_col.delete_many({})
            notifications_col.delete_many({})
            logging.getLogger(__name__).info("Wiped all old data for a clean slate.")
            
            # 2. Hash for passwords using passlib
            from passlib.context import CryptContext
            pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
            hashed_pw = pwd_context.hash("password123")
            
            # 3. Seed 1 Admin
            admin_doc = {
                "email": "admin@connectlife.com",
                "password_hash": hashed_pw,
                "role": "admin",
                "is_active": True,
                "created_at": datetime.utcnow().isoformat()
            }
            users_col.insert_one(admin_doc)
            logging.getLogger(__name__).info("Seeded Admin: admin@connectlife.com / password123")

            # 4. Seed 10 Hospitals
            cities = ["Bengaluru", "Mumbai", "Delhi", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow"]
            for i in range(1, 11):
                email = f"hospital{i}@connectlife.com"
                user_doc = {
                    "email": email,
                    "password_hash": hashed_pw,
                    "role": "hospital",
                    "is_active": True,
                    "created_at": datetime.utcnow().isoformat()
                }
                users_col.insert_one(user_doc)
                
                hospitals_col.insert_one({
                    "hospital_name": f"City Care Hospital {i}",
                    "city": cities[i-1],
                    "contact_number": f"+9199887766{i:02d}",
                    "email": email,
                    "address": f"{100 + i}, Medical Square, {cities[i-1]}",
                    "is_active": True
                })
            logging.getLogger(__name__).info("Seeded 10 Hospitals (hospital1-10@connectlife.com)")

            # 5. Seed 10 Donors
            blood_groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "O+", "A+"]
            organs_list = ["Kidney", "Liver", "Heart", "Lungs", "Pancreas", "Eyes", "Skin"]
            for i in range(1, 11):
                email = f"donor{i}@connectlife.com"
                user_res = users_col.insert_one({
                    "email": email,
                    "password_hash": hashed_pw,
                    "role": "donor",
                    "is_active": True,
                    "created_at": datetime.utcnow().isoformat()
                })
                
                donors_col.insert_one({
                    "user_id": str(user_res.inserted_id),
                    "first_name": f"Donor",
                    "last_name": str(i),
                    "email": email,
                    "mobile": f"+9198765432{i:02d}",
                    "address": f"Street {i}, {cities[i-1]}",
                    "blood_group": blood_groups[i-1],
                    "donate_blood": True,
                    "organs": [organs_list[i % len(organs_list)]],
                    "availability": True,
                    "is_verified": True
                })
            logging.getLogger(__name__).info("Seeded 10 Donors (donor1-10@connectlife.com)")

            # 6. Seed 10 Recipients & 20 Requests
            urgencies = ["low", "medium", "high", "critical"]
            for i in range(1, 11):
                email = f"recipient{i}@connectlife.com"
                user_res = users_col.insert_one({
                    "email": email,
                    "password_hash": hashed_pw,
                    "role": "recipient",
                    "is_active": True,
                    "created_at": datetime.utcnow().isoformat()
                })
                
                # Blood Request
                requests_col.insert_one({
                    "user_id": str(user_res.inserted_id),
                    "patient_name": f"Patient B-{i}",
                    "age": 20 + i,
                    "blood_group": blood_groups[(i+2)%10],
                    "organ": "Whole Blood",
                    "quantity": i % 3 + 1,
                    "hospital_location": f"City Care Hospital {i}",
                    "urgency": urgencies[i % 4],
                    "required_date": (datetime.utcnow() + timedelta(days=2)).isoformat(),
                    "status": "pending",
                    "created_at": datetime.utcnow().isoformat()
                })
                
                # Organ Request
                requests_col.insert_one({
                    "user_id": str(user_res.inserted_id),
                    "patient_name": f"Patient O-{i}",
                    "age": 40 + i,
                    "blood_group": blood_groups[i-1],
                    "organ": organs_list[i % len(organs_list)],
                    "hospital_location": f"City Care Hospital {i}",
                    "urgency": urgencies[(i+1) % 4],
                    "required_date": (datetime.utcnow() + timedelta(days=30)).isoformat(),
                    "status": "pending",
                    "created_at": datetime.utcnow().isoformat(),
                    "consent_agreement": True
                })
            logging.getLogger(__name__).info("Seeded 10 Recipients (recipient1-10@connectlife.com) and 20 Requests")

        except Exception as seed_err:
            logging.getLogger(__name__).error(f"Failed to seed mock users: {seed_err}")

