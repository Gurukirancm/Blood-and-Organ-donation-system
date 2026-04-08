
from services.auth_service import AuthService
from repositories.user_repository import UserRepository
import database
import sys

print("--- Creating Hospital User ---")
# Initialize DB
database.init_db()

auth_service = AuthService()
repo = UserRepository()

email = "admin@hospital.com"
password = "password123"
role = "hospital"

existing = repo.get_by_email(email)
if existing:
    print(f"User {email} already exists.")
else:
    try:
        user = auth_service.register_user(email, password, role)
        print(f"User {email} created successfully with role {role}.")
    except Exception as e:
        print(f"Error creating user: {e}")
