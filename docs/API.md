# API Reference Documentation

**Smart Blood & Organ Donation System - Complete API Reference**

*Base URL*: `http://localhost:8000`

## Authentication Endpoints

### Login (Get JWT Token)

```
POST /api/auth/token
Query Parameters:
  - email: str (required)
  - password: str (required)

Example Request:
  POST /api/auth/token?email=test@example.com&password=password123

Response (200 OK):
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}

Error Responses:
  400: Invalid credentials
  422: Validation error
```

### Register New User

```
POST /api/auth/register
Body (JSON):
{
  "email": "john@example.com",
  "password": "securepass123",
  "role": "donor"  # or "hospital", "admin"
}

Response (200 OK):
{
  "status": "success",
  "message": "User registered successfully",
  "user_id": "user_123",
  "email": "john@example.com",
  "role": "donor"
}

Error Responses:
  400: Email already exists
  422: Validation error
```

### Get Current User Profile

```
GET /api/auth/me
Headers:
  Authorization: Bearer <token>

Response (200 OK):
{
  "user_id": "user_123",
  "email": "test@example.com",
  "role": "donor",
  "created_at": "2024-01-01T10:00:00"
}

Error Responses:
  401: Unauthorized (invalid/missing token)
  422: Token validation error
```

---

## Donor Endpoints

### List All Donors

```
GET /api/donors

Query Parameters:
  (None - returns all donors)

Response (200 OK):
[
  {
    "id": "donor_1",
    "name": "John Doe",
    "email": "john@example.com",
    "blood_group": "O+",
    "available_organs": ["kidney", "liver"],
    "health_status": "good",
    "is_available": true,
    "created_at": "2024-01-01T10:00:00"
  },
  ...
]
```

### Register New Donor

```
POST /api/donors
Body (JSON):
{
  "name": "John Doe",
  "email": "john@example.com",
  "blood_group": "O+",
  "available_organs": ["kidney", "liver"],
  "health_status": "good",
  "is_available": true
}

Response (200 OK):
{
  "status": "success",
  "donor_id": "donor_1",
  "message": "Donor registered successfully",
  "data": {
    "id": "donor_1",
    "name": "John Doe",
    "email": "john@example.com",
    "blood_group": "O+",
    "available_organs": ["kidney", "liver"],
    "health_status": "good",
    "is_available": true,
    "created_at": "2024-01-01T10:00:00"
  }
}

Error Responses:
  400: Email already registered
  422: Validation error
```

### Get Donor Profile

```
GET /api/donors/{donor_id}

Response (200 OK):
{
  "id": "donor_1",
  "name": "John Doe",
  "email": "john@example.com",
  "blood_group": "O+",
  "available_organs": ["kidney", "liver"],
  "health_status": "good",
  "is_available": true,
  "created_at": "2024-01-01T10:00:00"
}

Error Responses:
  404: Donor not found
```

### Update Donor Profile

```
PUT /api/donors/{donor_id}
Body (JSON):
{
  "name": "John Doe Updated",
  "health_status": "fair",
  "is_available": false
}

Response (200 OK):
{
  "status": "success",
  "message": "Donor updated successfully",
  "data": {
    "id": "donor_1",
    "name": "John Doe Updated",
    ...
    "updated_at": "2024-01-15T15:30:00"
  }
}

Error Responses:
  404: Donor not found
  422: Validation error
```

### Find Matching Requests

```
GET /api/donors/{donor_id}/matches?organ=kidney&limit=5

Query Parameters:
  - organ: str (required) - Organ to donate (kidney, liver, heart, etc.)
  - limit: int (optional, default=5, max=20) - Max results

Response (200 OK):
{
  "status": "success",
  "donor_id": "donor_1",
  "total_matches": 3,
  "matches": [
    {
      "request_id": "request_1",
      "hospital_id": "hospital_1",
      "organ": "kidney",
      "urgency": "urgent",
      "compatibility_score": 87.5,
      "explanation": "Strong candidate: Perfect blood group match (O+), exact organ match (kidney)..."
    },
    ...
  ]
}

Error Responses:
  404: Donor not found
  400: Donor does not offer specified organ
```

### Get Donor History (Blockchain)

```
GET /api/donors/{donor_id}/history

Response (200 OK):
{
  "status": "success",
  "donor_id": "donor_1",
  "transaction_count": 2,
  "transactions": [
    {
      "index": 0,
      "timestamp": "2024-01-01T10:00:00",
      "event_type": "DONOR_REGISTRATION",
      "entity_type": "Donor",
      "entity_id": "donor_1",
      "action": "registered",
      "details": {
        "donor_name": "John Doe",
        "blood_group": "O+"
      },
      "hash": "abc123...",
      "previous_hash": "0"
    },
    ...
  ]
}

Error Responses:
  404: Donor not found
```

---

## Hospital Endpoints

### List All Hospitals

```
GET /api/hospitals

Response (200 OK):
[
  {
    "id": "hospital_1",
    "name": "City Medical Center",
    "email": "contact@cityhospital.org",
    "location": "Downtown",
    "contact_phone": "+1234567890",
    "created_at": "2024-01-01T10:00:00"
  },
  ...
]
```

### Register New Hospital

```
POST /api/hospitals
Body (JSON):
{
  "name": "City Medical Center",
  "email": "contact@cityhospital.org",
  "location": "Downtown",
  "contact_phone": "+1234567890"
}

Response (200 OK):
{
  "status": "success",
  "hospital_id": "hospital_1",
  "message": "Hospital registered successfully",
  "data": {
    "id": "hospital_1",
    "name": "City Medical Center",
    ...
  }
}
```

### Get Hospital Profile

```
GET /api/hospitals/{hospital_id}

Response (200 OK):
{
  "id": "hospital_1",
  "name": "City Medical Center",
  ...
}
```

### Update Hospital Profile

```
PUT /api/hospitals/{hospital_id}
Body (JSON):
{
  "contact_phone": "+9876543210",
  "location": "Uptown"
}

Response (200 OK):
{
  "status": "success",
  "message": "Hospital updated successfully",
  "data": { ... }
}
```

### Create Donation Request

```
POST /api/hospitals/{hospital_id}/requests
Body (JSON):
{
  "blood_group": "O+",
  "organ": "kidney",
  "urgency": "urgent",
  "patient_name": "Jane Smith"
}

Response (200 OK):
{
  "status": "success",
  "request_id": "request_1",
  "message": "Donation request created successfully",
  "data": {
    "id": "request_1",
    "hospital_id": "hospital_1",
    "blood_group": "O+",
    "organ": "kidney",
    "urgency": "urgent",
    "patient_name": "Jane Smith",
    "status": "pending",
    "created_at": "2024-01-15T10:00:00"
  },
  "matches_found": 2,
  "matches": [
    {
      "donor_id": "donor_1",
      "donor_name": "John Doe",
      "blood_group": "O+",
      "compatibility_score": 87.5,
      "explanation": "..."
    },
    ...
  ]
}

Error Responses:
  404: Hospital not found
  422: Validation error
```

### Get Hospital Requests

```
GET /api/hospitals/{hospital_id}/requests?status=pending

Query Parameters:
  - status: str (optional) - Filter by status (pending, matched, completed)

Response (200 OK):
{
  "status": "success",
  "hospital_id": "hospital_1",
  "total_requests": 3,
  "requests": [
    {
      "id": "request_1",
      "hospital_id": "hospital_1",
      "blood_group": "O+",
      "organ": "kidney",
      "urgency": "urgent",
      "status": "pending",
      "created_at": "2024-01-15T10:00:00"
    },
    ...
  ]
}
```

---

## Admin & Analytics Endpoints

### System Statistics

```
GET /api/admin/stats

Response (200 OK):
{
  "status": "success",
  "data": {
    "total_donors": 42,
    "total_hospitals": 8,
    "total_requests": 15,
    "active_requests": 5,
    "completed_donations": 3,
    "pending_matches": 5,
    "confirmed_matches": 2,
    "urgent_requests": 2
  }
}
```

### Donor Analytics

```
GET /api/admin/donors

Response (200 OK):
{
  "status": "success",
  "data": {
    "total_donors": 42,
    "available_donors": 38,
    "blood_group_distribution": {
      "O+": 12,
      "O-": 3,
      "A+": 10,
      "A-": 2,
      "B+": 8,
      "B-": 2,
      "AB+": 4,
      "AB-": 1
    },
    "donor_registration_rate": "5/week"
  }
}
```

### Hospital Analytics

```
GET /api/admin/hospitals

Response (200 OK):
{
  "status": "success",
  "data": {
    "total_hospitals": 8,
    "total_requests": 15,
    "average_requests_per_hospital": 1.875,
    "requests_per_hospital": {
      "hospital_1": 3,
      "hospital_2": 2,
      ...
    }
  }
}
```

### Request Analytics

```
GET /api/admin/requests

Response (200 OK):
{
  "status": "success",
  "data": {
    "total_requests": 15,
    "organ_distribution": {
      "kidney": 5,
      "liver": 4,
      "heart": 3,
      "pancreas": 3
    },
    "urgency_distribution": {
      "urgent": 5,
      "normal": 8,
      "low": 2
    },
    "status_distribution": {
      "pending": 5,
      "matched": 2,
      "confirmed": 2,
      "completed": 3,
      "cancelled": 3
    },
    "success_rate": 20.0
  }
}
```

### Match Quality Metrics

```
GET /api/admin/matches

Response (200 OK):
{
  "status": "success",
  "data": {
    "total_matches_found": 7,
    "average_compatibility_score": 78.43,
    "match_success_rate": 0.467,
    "matched_to_total_ratio": "7/15"
  }
}
```

### Blood Group Insights

```
GET /api/admin/blood-groups

Response (200 OK):
{
  "status": "success",
  "data": {
    "donor_blood_distribution": {
      "O+": 12,
      "O-": 3,
      "A+": 10,
      ...
    },
    "recipient_blood_needs": {
      "O+": 5,
      "O-": 1,
      "A+": 4,
      ...
    },
    "supply_demand_ratio": {
      "O+": 2.4,
      "O-": 3.0,
      "A+": 2.5,
      ...
    }
  }
}
```

### Admin Dashboard (Comprehensive)

```
GET /api/admin/dashboard

Response (200 OK):
{
  "status": "success",
  "data": {
    "system_stats": { ... },
    "donor_stats": { ... },
    "hospital_stats": { ... },
    "request_stats": { ... },
    "match_quality": { ... },
    "blood_group_insights": { ... },
    "timestamp": "2024-01-15T15:30:00"
  }
}
```

### Recent Activity

```
GET /api/admin/activity?hours=24

Query Parameters:
  - hours: int (default=24, range=1-365) - Activity window

Response (200 OK):
{
  "status": "success",
  "data": {
    "recent_donor_registrations": 3,
    "recent_requests_created": 2,
    "hours_window": 24
  }
}
```

### Ledger Status

```
GET /api/admin/ledger

Response (200 OK):
{
  "status": "success",
  "ledger_status": {
    "total_transactions": 45,
    "is_valid": true,
    "integrity_check": "PASS"
  }
}
```

### Ledger Transactions

```
GET /api/admin/ledger/transactions?entity_id=donor_1&limit=10

Query Parameters:
  - entity_id: str (optional) - Filter by entity
  - limit: int (default=100, max=1000) - Result limit

Response (200 OK):
{
  "status": "success",
  "total_transactions": 45,
  "transactions": [
    {
      "index": 0,
      "timestamp": "2024-01-01T10:00:00",
      "event_type": "DONOR_REGISTRATION",
      "entity_type": "Donor",
      "entity_id": "donor_1",
      "action": "registered",
      "details": { ... },
      "hash": "abc123..."
    },
    ...
  ]
}
```

---

## Error Handling

### Standard Error Response

```json
{
  "detail": "Error message here"
}
```

### Common Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Access denied |
| 404 | Not Found | Resource not found |
| 422 | Validation Error | Invalid data format |
| 500 | Server Error | Unexpected error |

---

## Rate Limiting

Currently no rate limiting. Recommended for production:
- 100 requests/minute per IP
- 1000 requests/hour per authenticated user

---

## API Documentation (Interactive)

Access Swagger UI: `http://localhost:8000/docs`
Access ReDoc: `http://localhost:8000/redoc`

---

**Document Version**: 1.0
**Last Updated**: 2024-01-15
**API Version**: 2.0
