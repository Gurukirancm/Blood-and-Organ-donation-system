from fastapi.testclient import TestClient
from backend.api.main import app


def run_checks():
    client = TestClient(app)
    h = client.get("/api/health")
    print("health ->", h.status_code, h.json())
    d = client.get("/api/donors/")
    print("donors ->", d.status_code)
    try:
        print("donors body ->", d.json())
    except Exception as e:
        print("donors body parse error:", e)


if __name__ == "__main__":
    run_checks()
