
import urllib.request
import json
import time

url = "http://localhost:8000/api/auth/token"
payload = {
    "email": "admin@hospital.com",
    "password": "password123"
}
data = json.dumps(payload).encode('utf-8')
headers = {
    "Content-Type": "application/json"
}

print("Waiting for server to start...")
time.sleep(5) 

print(f"Attempting login for {payload['email']}...")
req = urllib.request.Request(url, data=data, headers=headers, method='POST')

try:
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.getcode()}")
        body = response.read().decode('utf-8')
        print(f"Response Body: {body}")
        if "access_token" in body:
            print("SUCCESS: Login successful!")
        else:
            print("FAILURE: Token not found in response.")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code} - {e.read().decode('utf-8')}")
except Exception as e:
    print(f"Error: {e}")
