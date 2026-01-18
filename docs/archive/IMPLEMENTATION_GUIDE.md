# Implementation Guide - Production Deployment

**Smart Blood & Organ Donation Management System v2.0**

## Table of Contents

1. [Getting Started](#getting-started)
2. [Running the System](#running-the-system)
3. [Testing the API](#testing-the-api)
4. [Database Migration Path](#database-migration-path)
5. [Deployment Options](#deployment-options)
6. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- pip and npm
- Git (for version control)
- Optional: Docker for containerization

### Step 1: Clone/Download Repository

```bash
cd c:\Users\gurud\smart blood and organ donation management system
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r api/requirements.txt

# Verify installation
python -m pip list | grep -i fastapi
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend
cd ..\frontend

# Install dependencies
npm install

# Verify installation
npm list react vite
```

## Running the System

### Start Backend Server

```bash
# From backend directory with venv activated
python main.py

# You should see:
# INFO:     Started server process [12345]
# INFO:     Uvicorn running on http://127.0.0.1:8000
# INFO:     Press CTRL+C to quit
```

### Start Frontend Server

```bash
# From frontend directory (in separate terminal)
npm run dev

# You should see:
# VITE v5.4.21 ready in 239 ms
# ➜  Local:   http://localhost:5173/
```

### Access the System

- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:8000/docs
- **Backend Health**: http://localhost:8000/api/health

### Test Credentials

```
Email: test@example.com
Password: password123
Role: donor
```

## Testing the API

### Test 1: Login

```bash
curl -X POST "http://localhost:8000/api/auth/token?email=test@example.com&password=password123"

# Expected Response:
# {
#   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "token_type": "bearer"
# }
```

### Test 2: Register New Donor

```bash
curl -X POST "http://localhost:8000/api/donors" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "blood_group": "A+",
    "available_organs": ["kidney"],
    "health_status": "good",
    "is_available": true
  }'

# Expected Response:
# {
#   "status": "success",
#   "donor_id": "donor_2",
#   "message": "Donor registered successfully",
#   "data": { ... }
# }
```

### Test 3: Register Hospital

```bash
curl -X POST "http://localhost:8000/api/hospitals" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Central Hospital",
    "email": "admin@central-hospital.org",
    "location": "Downtown",
    "contact_phone": "+1-555-0100"
  }'

# Expected Response:
# {
#   "status": "success",
#   "hospital_id": "hospital_1",
#   "message": "Hospital registered successfully",
#   "data": { ... }
# }
```

### Test 4: Create Donation Request & Find Matches

```bash
curl -X POST "http://localhost:8000/api/hospitals/hospital_1/requests" \
  -H "Content-Type: application/json" \
  -d '{
    "blood_group": "A+",
    "organ": "kidney",
    "urgency": "urgent",
    "patient_name": "Bob Smith"
  }'

# Expected Response includes:
# {
#   "status": "success",
#   "request_id": "request_1",
#   "matches_found": 1,
#   "matches": [
#     {
#       "donor_id": "donor_2",
#       "donor_name": "Alice Johnson",
#       "compatibility_score": 100.0,
#       "explanation": "Perfect match..."
#     }
#   ]
# }
```

### Test 5: Get Admin Dashboard

```bash
curl "http://localhost:8000/api/admin/dashboard"

# Expected Response:
# {
#   "status": "success",
#   "data": {
#     "system_stats": { ... },
#     "donor_stats": { ... },
#     "hospital_stats": { ... },
#     "request_stats": { ... },
#     "match_quality": { ... },
#     "blood_group_insights": { ... }
#   }
# }
```

### Test 6: Verify Blockchain

```bash
curl "http://localhost:8000/api/admin/ledger"

# Expected Response:
# {
#   "status": "success",
#   "ledger_status": {
#     "total_transactions": 5,
#     "is_valid": true,
#     "integrity_check": "PASS"
#   }
# }
```

## Database Migration Path

### Current: File-Based Storage

**Pros**:
- No database setup required
- Fast development
- Easy backup (copy JSON files)

**Cons**:
- Not suitable for production
- Limited concurrency
- Slower with large datasets

### Phase 1: Migrate to PostgreSQL

#### Step 1: Install PostgreSQL

```bash
# Windows: Download from https://www.postgresql.org/download/windows/
# Or use Chocolatey: choco install postgresql

# Verify installation
psql --version
```

#### Step 2: Create Database

```sql
-- Create database
CREATE DATABASE donation_system;

-- Create schema
CREATE SCHEMA donation;

-- Create donors table
CREATE TABLE donation.donors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    blood_group VARCHAR(3) NOT NULL,
    available_organs TEXT[] NOT NULL,
    health_status VARCHAR(50),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Similar for hospitals, requests, etc.
```

#### Step 3: Update Repository

```python
# Replace backend/repositories/repository.py implementation
# Example:

from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

class DonorRepository(Repository):
    def __init__(self, db_url: str = "postgresql://user:pass@localhost/donation_system"):
        self.engine = create_engine(db_url)
    
    def create(self, donor: Dict) -> Dict:
        with Session(self.engine) as session:
            db_donor = Donor(**donor)
            session.add(db_donor)
            session.commit()
            return {**donor, "id": db_donor.id}
```

#### Step 4: Update Requirements

```bash
pip install sqlalchemy psycopg2-binary
pip freeze > requirements.txt
```

#### Step 5: Test Migration

```bash
# Run existing tests
python -m pytest backend/tests/

# All tests should pass without code changes to routes/services!
```

### Phase 2: Add Caching (Redis)

```python
# In services/
from redis import Redis

cache = Redis(host='localhost', port=6379)

# Cache frequently accessed data
@router.get("/donors")
async def list_donors():
    cached = cache.get("all_donors")
    if cached:
        return json.loads(cached)
    
    donors = donor_repo.get_all()
    cache.setex("all_donors", 3600, json.dumps(donors))  # 1 hour
    return donors
```

## Deployment Options

### Option 1: Local Development

```bash
# Already configured - just run:
python backend/main.py
npm run dev
```

### Option 2: Docker Containerization

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://user:pass@db/donation_system
    depends_on:
      - db
  
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
  
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: donation_system
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Then:

```bash
docker-compose up
```

### Option 3: AWS Deployment

#### Elastic Beanstalk

```bash
# Install AWS CLI
pip install awsebcli

# Initialize
eb init -p python-3.11 donation-system

# Deploy backend
eb create donation-backend
eb deploy

# Static frontend to S3
aws s3 sync frontend/dist s3://donation-frontend/
```

#### RDS for Database

```bash
# AWS CLI creates managed PostgreSQL
aws rds create-db-instance \
  --db-instance-identifier donation-db \
  --db-instance-class db.t3.micro \
  --engine postgres
```

### Option 4: Azure Deployment

#### App Service

```bash
# Install Azure CLI
choco install azure-cli

# Login
az login

# Create resource group
az group create -n donation-rg -l eastus

# Create App Service
az appservice plan create -n donation-plan -g donation-rg --sku B1 --is-linux

# Deploy
az webapp up --name donation-backend --resource-group donation-rg
```

### Option 5: Google Cloud Deployment

#### Cloud Run

```bash
# Install gcloud CLI
choco install google-cloud-sdk

# Authenticate
gcloud auth login

# Build container
gcloud builds submit --tag gcr.io/PROJECT_ID/donation-backend

# Deploy
gcloud run deploy donation-backend \
  --image gcr.io/PROJECT_ID/donation-backend \
  --platform managed \
  --region us-central1
```

## Troubleshooting

### Issue: Backend won't start

**Error**: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**:
```bash
# Ensure venv is activated
venv\Scripts\activate

# Reinstall dependencies
pip install -r api/requirements.txt
```

### Issue: Frontend can't connect to backend

**Error**: `CORS error` or `Connection refused`

**Solution**:
```bash
# Check backend is running
curl http://localhost:8000/api/health

# Check CORS configuration in main.py
# Ensure frontend URL is in allow_origins
```

### Issue: Blockchain integrity check fails

**Error**: `integrity_check: FAIL`

**Solution**:
```bash
# Blockchain was corrupted, reset it
rm backend/ledger_chain.json

# Restart backend
python main.py

# Blockchain will be recreated on first transaction
```

### Issue: Port already in use

**Error**: `Address already in use`

**Solution**:
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process (e.g., PID 12345)
taskkill /PID 12345 /F
```

### Issue: Database connection failed

**Error**: `ConnectionRefusedError: [Errno 111] Connection refused`

**Solution**:
```bash
# Ensure PostgreSQL is running
pg_isready

# Check connection string in .env
DATABASE_URL=postgresql://user:password@localhost:5432/donation_system
```

## Next Steps

1. **Review Documentation**
   - Read: `docs/ARCHITECTURE.md` for system design
   - Read: `docs/API.md` for all endpoints

2. **Test the System**
   - Run: `python test_complete_system.py`
   - Use: Swagger UI at `/docs`

3. **Customize Configuration**
   - Email settings for production SMTP
   - Database URL for production database
   - API keys for SMS provider

4. **Deploy to Production**
   - Choose deployment option above
   - Configure environment variables
   - Set up monitoring and logging

5. **Monitor Performance**
   - Use admin dashboard: `/api/admin/dashboard`
   - Check blockchain integrity: `/api/admin/ledger`
   - Review analytics: `/api/admin/*`

## Support & Contact

- **Documentation**: See `README.md` and `docs/` folder
- **API Help**: Visit `/docs` endpoint
- **Code Issues**: Check existing test files

---

**Version**: 2.0.0
**Last Updated**: January 15, 2024
**Status**: ✅ Ready for Production
