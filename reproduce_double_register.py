
import urllib.request
import json

url = "http://localhost:8000/api/auth/register"
payload = {
    "email": "duplicate_test@example.com",
    "password": "password123",
    "role": "donor"
}
data = json.dumps(payload).encode('utf-8')
headers = {
    "Content-Type": "application/json"
}

def register():
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Status Code: {response.getcode()}")
            print(f"Response Body: {response.read().decode('utf-8')}")
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} - {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Error: {e}")

print("--- First Attempt (Should Succeed) ---")
register()
print("\n--- Second Attempt (Should Fail with 400) ---")
register()
