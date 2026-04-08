
import urllib.request
import json

url = "http://localhost:8000/api/auth/token"
payload = {
    "email": "admin@connectlife.com",
    "password": "adminpassword123"
}
data = json.dumps(payload).encode('utf-8')

req = urllib.request.Request(url, data=data, method="POST")
req.add_header("Content-Type", "application/json")

try:
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.status}")
        response_body = response.read().decode()
        print(f"Response: {response_body}")
        
        if "access_token" in response_body:
             print("LOGIN SUCCESS!")
        else:
             print("LOGIN FAILED - No token")

except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(f"Reason: {e.read().decode()}")
except Exception as e:
    print(f"Error: {e}")
