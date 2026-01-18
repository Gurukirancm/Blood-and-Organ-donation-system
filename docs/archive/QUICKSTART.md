# Quick Start Guide

## Project: Smart Blood & Organ Donation Management System

---

## Getting Started (5 minutes)

### 1. Start the Servers

**Terminal 1 - Backend:**
```bash
cd "c:\Users\gurud\smart bllod and organ donation management system"
.venv\Scripts\python.exe -m uvicorn backend.api.main:app --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd "c:\Users\gurud\smart bllod and organ donation management system\frontend"
npm run dev
```

### 2. Access the Application
- **Frontend:** http://localhost:5173
- **API Docs:** http://127.0.0.1:8000/docs

---

## Login Credentials

Use any of these accounts:

| Role | Email | Password |
|------|-------|----------|
| **Donor** | john.donor@example.com | TestPassword123! |
| **Hospital** | medical.hospital@example.com | TestPassword123! |
| **Admin** | admin@example.com | TestPassword123! |

---

## What Each Role Can Do

### 👨 Donor
- View all registered donors
- See blood groups and organ availability
- Check donation opportunities
- Manage profile

### 🏥 Hospital
- Use AI matching algorithm to find compatible donors
- Search by blood group and organ type
- View match scores
- Track donation requests

### 👨‍💼 Admin
- View system statistics
- See total donors, hospitals, and requests
- Monitor overall system activity
- Generate reports

---

## Test the Matching Algorithm

1. **Login as Hospital:**
   - Email: `medical.hospital@example.com`
   - Password: `TestPassword123!`

2. **Use Matching Form:**
   - Blood Group: Select "O+"
   - Organ Type: Select "Kidney"
   - Urgency: Select "high"
   - Click "Find Matches"

3. **View Results:**
   - System shows compatible donors with scores
   - Score = Compatibility + Urgency + Availability

---

## API Examples

### Register New User
```bash
curl -X POST "http://127.0.0.1:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123!",
    "role": "donor"
  }'
```

### Login
```bash
curl -X POST "http://127.0.0.1:8000/api/auth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=john.donor@example.com&password=TestPassword123!"
```

### List All Donors
```bash
curl -X GET "http://127.0.0.1:8000/api/donors/" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Donation Request
```bash
curl -X POST "http://127.0.0.1:8000/api/requests/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "blood_group": "O+",
    "organ": "Kidney",
    "urgency": "high"
  }'
```

### Find Matching Donors
```bash
curl -X POST "http://127.0.0.1:8000/api/requests/match" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "blood_group": "O+",
    "organ": "Kidney",
    "urgency": "high"
  }'
```

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│         http://localhost:5173                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Dashboard   │  │  Dashboard   │  │  Dashboard   │  │
│  │    Donor     │  │  Hospital    │  │    Admin     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/REST + JWT
┌────────────────────────▼────────────────────────────────┐
│                    Backend (FastAPI)                     │
│         http://127.0.0.1:8000                           │
│  ┌────────────┐ ┌────────────┐ ┌────────────────────┐  │
│  │   Auth     │ │   Donors   │ │   Hospitals        │  │
│  │  Endpoints │ │ Endpoints  │ │   Endpoints        │  │
│  └────────────┘ └────────────┘ └────────────────────┘  │
│  ┌────────────────────────┐ ┌──────────────────────┐   │
│  │   Requests/Matching    │ │   AI Matching       │   │
│  │   Endpoints            │ │   Algorithm         │   │
│  └────────────────────────┘ └──────────────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│            Database (SQLite / PostgreSQL)               │
│  ┌──────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │Users │ │  Donors  │ │Hospitals │ │   Requests   │  │
│  └──────┘ └──────────┘ └──────────┘ └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Key Files

| File | Purpose |
|------|---------|
| `backend/api/main.py` | FastAPI app entry point |
| `backend/api/auth.py` | Authentication logic |
| `backend/api/models.py` | Database models |
| `backend/ai/matching.py` | Matching algorithm |
| `frontend/src/App.jsx` | React app routing |
| `frontend/src/api.js` | API client configuration |
| `app.db` | SQLite database |

---

## Troubleshooting

### Q: "Backend not running on port 8000"
**A:** Kill existing processes and restart:
```bash
taskkill /F /IM python.exe
# Then start backend again
```

### Q: "CORS error in browser"
**A:** CORS is already enabled. Try:
- Hard refresh (Ctrl+Shift+R)
- Clear browser cache
- Check backend is running

### Q: "Login failed with 422 error"
**A:** Check:
- Email address is correct
- Password is "TestPassword123!" (case-sensitive)
- User exists in database

### Q: "Database errors"
**A:** Reset database:
```bash
del app.db
# Restart backend (will auto-create)
```

---

## Database Contents

**4 Test Users:**
- john.donor@example.com (Donor)
- medical.hospital@example.com (Hospital)
- admin@example.com (Admin)

**5 Sample Donors:**
- Raj Kumar, Priya Singh, Amit Patel, Neha Sharma, Test Donor

**4 Sample Hospitals:**
- Apollo Hospital, Max Healthcare, Manipal Hospital, Test Hospital

**4 Donation Requests:**
- Kidney (O+), Liver (A+), Heart (B+), Kidney (O+)

---

## API Response Examples

### Success (200)
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "Raj Kumar",
    "blood_group": "O+",
    "organ": "Kidney"
  }
}
```

### Error (400)
```json
{
  "detail": "Incorrect username or password"
}
```

### Authentication Required (401)
```json
{
  "detail": "Not authenticated"
}
```

---

## Features Summary

| Feature | Status |
|---------|--------|
| User Registration | ✅ |
| JWT Authentication | ✅ |
| Role-Based Access | ✅ |
| Donor Management | ✅ |
| Hospital Management | ✅ |
| Donation Requests | ✅ |
| Matching Algorithm | ✅ |
| Admin Dashboard | ✅ |
| Hospital Dashboard | ✅ |
| Donor Dashboard | ✅ |
| API Documentation | ✅ |

---

## Support

For detailed API documentation, visit:
**http://127.0.0.1:8000/docs** (when backend is running)

---

**Ready to go! Happy donating! 🩸❤️**
