import json

# Test data
test_data = {
    "email": "test@example.com",
    "password": "password123"
}

print("JSON to send:")
print(json.dumps(test_data))
print("\nCurl command:")
print(f'curl -X POST "http://localhost:8000/api/auth/register" -H "Content-Type: application/json" -d \'{json.dumps(test_data)}\'')
