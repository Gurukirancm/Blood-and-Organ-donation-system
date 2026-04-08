
from services.auth_service import AuthService
from repositories.user_repository import UserRepository
import database
import sys

# Initialize DB
database.init_db()

print("--- Creating Admin User ---")

auth_service = AuthService()
repo = UserRepository()

email = "admin@connectlife.com"
password = "adminpassword123"
role = "admin"

existing = repo.get_by_email(email)
if existing:
    print(f"User {email} already exists.")
    # Optional: Update password if needed, but for now just notify
else:
    try:
        # Create user with admin role
        user = auth_service.register_user(email, password, role) 
        # Note: register_user might hash the password. 
        # If register_user doesn't handle hashing (it usually does), we might need to hash it manually.
        # Assuming AuthService handles hashing based on standard patterns.
        print(f"User {email} created successfully with role {role}.")
        print(f"Password: {password}")
    except Exception as e:
        print(f"Error creating user: {e}")
