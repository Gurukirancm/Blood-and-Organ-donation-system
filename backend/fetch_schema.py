import requests
import json
try:
    response = requests.get("http://127.0.0.1:8000/openapi.json")
    schema = response.json()
    print(json.dumps(schema, indent=2))
except Exception as e:
    print(e)
