import requests
import json

BASE_URL = "http://localhost:8000"

# Test 1: Register a user
print("=" * 50)
print("TEST 1: Register User")
print("=" * 50)
register_data = {
    "email": "testuser@example.com",
    "password": "password123",
    "role": "donor"
}
try:
    response = requests.post(f"{BASE_URL}/api/auth/register", json=register_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")

# Test 2: Login with the registered user
print("\n" + "=" * 50)
print("TEST 2: Login User")
print("=" * 50)
login_data = {
    "email": "testuser@example.com",
    "password": "password123"
}
try:
    response = requests.post(f"{BASE_URL}/api/auth/token", json=login_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        token = response.json().get("access_token")
        print(f"\nToken received: {token[:50]}...")
        
        # Test 3: Get user info with token
        print("\n" + "=" * 50)
        print("TEST 3: Get User Info")
        print("=" * 50)
        headers = {"Authorization": f"Bearer {token}"}
        me_response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
        print(f"Status Code: {me_response.status_code}")
        print(f"Response: {me_response.json()}")
except Exception as e:
    print(f"Error: {e}")
