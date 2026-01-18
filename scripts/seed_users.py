import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.services.auth_service import AuthService
from backend.repositories.user_repository import UserRepository

def seed_users():
    auth_service = AuthService()
    user_repo = UserRepository()
    
    # Clear existing users to avoid duplicates during dev
    user_repo.collection.delete_many({})
    print("Cleared existing users.")

    users = [
        ("donor@test.com", "password123", "donor"),
        ("recipient@test.com", "password123", "recipient"),
        ("hospital@test.com", "password123", "hospital"),
        ("admin@test.com", "password123", "admin")
    ]

    for email, password, role in users:
        try:
            auth_service.register_user(email, password, role)
            print(f"Created user: {email} ({role})")
        except ValueError:
            print(f"User {email} already exists")
        except Exception as e:
            print(f"Error creating {email}: {e}")

if __name__ == "__main__":
    seed_users()
