
from pymongo import MongoClient
from core.config import settings
import sys

# Connect to DB
client = MongoClient(settings.MONGO_URL)
db = client[settings.DB_NAME]
users_collection = db["users"]

print("--- Checking Users ---")
users = list(users_collection.find({"role": "hospital"}))
print(f"Found {len(users)} hospital users.")
for u in users:
    print(f"Email: {u.get('email')}, Role: {u.get('role')}, Hash: {u.get('password_hash')[:10]}...")

if len(users) == 0:
    print("No hospital users found. Registration might have failed or not been attempted yet.")
