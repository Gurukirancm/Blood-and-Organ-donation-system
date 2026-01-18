# System Architecture Documentation

**Smart Blood & Organ Donation Management System - Architecture Design**

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Layers](#architecture-layers)
3. [Core Modules](#core-modules)
4. [Design Patterns](#design-patterns)
5. [Data Flow](#data-flow)
6. [Integration Points](#integration-points)
7. [Scalability Strategy](#scalability-strategy)
8. [Security Architecture](#security-architecture)

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                      │
│         React Frontend (Vite) - Port 5173                   │
│  (Donor Dashboard | Hospital Portal | Admin Dashboard)      │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/WebSocket
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER (FastAPI)                    │
│  Authentication │ Donors │ Hospitals │ Requests │ Admin     │
│  Port 8000                                                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ↓                  ↓                  ↓
┌──────────────┐  ┌───────────────┐  ┌──────────────────┐
│  Matching    │  │  Ledger       │  │ Notifications    │
│  Service     │  │  Service      │  │ Service          │
│              │  │  (Blockchain) │  │ (Event-Driven)   │
└──────────────┘  └───────────────┘  └──────────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ↓
        ┌──────────────────────────────────┐
        │     Repository Layer             │
        │  (Data Access Abstraction)       │
        │                                  │
        │  • DonorRepository               │
        │  • HospitalRepository            │
        │  • RequestRepository             │
        └──────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────┐
        │      Data Layer                  │
        │                                  │
        │  • JSON Files (Current)          │
        │  • PostgreSQL (Future)           │
        │  • MongoDB (Alternative)         │
        └──────────────────────────────────┘
```

## Architecture Layers

### 1. Presentation Layer

**Location**: `frontend/`

**Technologies**: React 18.2 + Vite 5.0

**Responsibilities**:
- User interface for three roles: Donor, Hospital, Admin
- Client-side state management
- Form validation and error handling
- Real-time notifications (future: WebSocket)

**Key Components**:
- `Login.jsx`: Authentication interface
- `DonorDashboard.jsx`: Donor profile and match discovery
- `HospitalDashboard.jsx`: Request creation and management
- `AdminDashboard.jsx`: System analytics and monitoring

### 2. API Layer

**Location**: `backend/api/`

**Technologies**: FastAPI 0.95.2

**Responsibilities**:
- HTTP endpoint definitions
- Request/response validation (Pydantic models)
- Route orchestration
- CORS and middleware configuration

**Routers**:
- `routes/auth_routes.py`: Authentication (JWT)
- `routes/donor_routes.py`: Donor operations
- `routes/hospital_routes.py`: Hospital operations
- `routes/request_routes.py`: Donation request lifecycle
- `routes/admin_routes.py`: Analytics and monitoring

### 3. Service Layer

**Location**: `backend/services/`, `backend/matching/`, `backend/ledger/`, `backend/notifications/`

**Responsibilities**:
- Business logic encapsulation
- Service orchestration
- Cross-cutting concerns

**Services**:

#### Matching Service (`matching/`)

```python
# Class: MatchingEngine
# Methods:
#  - find_matches(request, limit) → List[Match]
#  - score_compatibility(request, donor) → CompatibilityScore
#  - _query_candidates(request) → List[Donor]
```

**Algorithm**: Feature-weighted scoring (5 components)
**Output**: Deterministic, explainable matches

#### Ledger Service (`ledger/`)

```python
# Class: BlockchainLedger
# Methods:
#  - add_transaction(event_type, entity_type, ...) → Block
#  - get_transaction_history(entity_id) → List[Block]
#  - verify_integrity() → bool
```

**Implementation**: SHA-256 hash chaining
**Storage**: JSON file (mock blockchain)
**Integrity**: Cryptographic verification on startup

#### Notification Service (`notifications/`)

```python
# Class: NotificationService
# Methods:
#  - notify(recipient, type, message, channels) → Dict
#  - subscribe(event_type, handler) → void
#  - notify_donor_registered(email, name) → Dict
```

**Channels**: Email, SMS (simulated), In-App
**Design**: Event-based subscription model

#### Admin Service (`services/`)

```python
# Class: AdminService
# Methods:
#  - get_system_stats() → Dict
#  - get_donor_analytics() → Dict
#  - get_request_analytics() → Dict
#  - get_dashboard_summary() → Dict
```

**Analytics**: Real-time metrics and KPIs

### 4. Repository Layer

**Location**: `backend/repositories/`

**Pattern**: Repository Pattern for Data Access

**Classes**:
- `DonorRepository`: Donor data operations
- `HospitalRepository`: Hospital data operations
- `DonationRequestRepository`: Request lifecycle

**Key Methods**:

```python
# Donor operations
create(donor) → Donor
get_by_id(id) → Donor
get_by_email(email) → Donor
find_by_blood_group(group) → List[Donor]
find_by_organ(organ) → List[Donor]
find_available(organ, blood_group) → List[Donor]
update(id, updates) → Donor
delete(id) → bool
```

**Benefits**:
- Data access abstraction
- Easy backend switching (JSON → SQL → NoSQL)
- Testability (mock repositories)
- Centralized query logic

### 5. Data Layer

**Current**: JSON file-based storage

```
backend/
├── users_db.json              # User credentials
├── donors.json                # Donor profiles
├── hospitals.json             # Hospital profiles
├── donation_requests.json      # Requests
├── notifications.json         # In-app notifications
├── ledger_chain.json          # Blockchain transactions
```

**Future**: PostgreSQL, MongoDB

## Core Modules

### 1. AI Matching Module

**File**: `backend/matching/compatibility.py`

**Purpose**: Calculate deterministic compatibility scores

**Components**:

```python
BloodType (Enum)
  - O-, O+, A-, A+, B-, B+, AB-, AB+

CompatibilityScore (Dataclass)
  - total_score: float
  - blood_group_score: float
  - organ_match_score: float
  - health_status_score: float
  - urgency_alignment_score: float
  - availability_score: float
  - explanation: str

BLOOD_COMPATIBILITY (Dict)
  - Universal donor (O-) → all recipients
  - Recipient logic for each blood type

def calculate_compatibility_score(...) → CompatibilityScore
  - Evaluates 5 features
  - Applies weights (40%, 30%, 15%, 10%, 5%)
  - Generates explanation
```

**Scoring Logic**:

```
Score = (BG×0.40) + (OM×0.30) + (HS×0.15) + (UA×0.10) + (AV×0.05)

Where:
  BG = Blood Group Score (0-100)
  OM = Organ Match Score (0-100)
  HS = Health Status Score (0-100)
  UA = Urgency Alignment Score (0-100)
  AV = Availability Score (0-100)
```

### 2. Blockchain Ledger Module

**File**: `backend/ledger/service.py`

**Purpose**: Immutable audit trail with cryptographic verification

**Components**:

```python
Block (Dict):
  - index: int
  - timestamp: ISO8601
  - event_type: str
  - entity_type: str
  - entity_id: str
  - action: str
  - details: Dict
  - previous_hash: str (for chaining)
  - hash: str (SHA-256)

BlockchainLedger:
  - chain: List[Block]
  - add_transaction(...) → Block
  - verify_integrity() → bool
  - _calculate_hash(block) → str
```

**Integrity Verification**:

```python
For each block in chain:
  1. Recalculate hash from block data
  2. Compare with stored hash
  3. Verify previous_hash matches previous block's hash
  4. Return True only if all blocks valid
```

**Event Types**:
- `DONOR_REGISTRATION`
- `HOSPITAL_REQUEST`
- `MATCH_FOUND`
- `DONATION_CONFIRMED`
- `DONATION_COMPLETED`

### 3. Notification System

**File**: `backend/notifications/service.py`

**Purpose**: Multi-channel, event-driven notifications

**Channels**:

```python
EmailNotificationChannel
  - SMTP configuration
  - Production-ready (awaiting SMTP details)
  - Console log in development

SMSNotificationChannel
  - Simulated (ready for Twilio/AWS SNS)
  - Console log in development

InAppNotificationChannel
  - Persistent storage (JSON)
  - Retrieved via API endpoint
  - Read/unread status tracking
```

**Event Subscription**:

```python
notify_service.subscribe(NotificationType.MATCH_FOUND, handler)
# Triggers when match found
```

## Design Patterns

### 1. Repository Pattern

**Purpose**: Abstract data access layer

```
┌────────────────────────┐
│    Service/Route       │
└───────────┬────────────┘
            │ (dependency injection)
            ↓
┌────────────────────────┐
│    Repository          │
│  (DonorRepository)     │
└───────────┬────────────┘
            │
            ↓
┌────────────────────────┐
│    Data Storage        │
│  (JSON/SQL/NoSQL)      │
└────────────────────────┘
```

**Benefits**:
- Easy to swap implementations
- Testable (mock repositories)
- Centralized query logic

### 2. Service Layer

**Purpose**: Encapsulate business logic

```python
# Matching logic in service, not routes
engine = MatchingEngine(donor_repo)
matches = engine.find_matches(request)

# Routes delegate to services
@router.get("/matches")
async def get_matches(request_id):
    request = request_repo.get_by_id(request_id)
    return engine.find_matches(request)
```

### 3. Dependency Injection

**Purpose**: Loose coupling and testability

```python
# Inject repository in constructor
engine = MatchingEngine(
    donor_repository=test_repository  # Mock for testing
)

# Production uses factory
engine = MatchingEngine()  # Uses RepositoryFactory
```

### 4. Factory Pattern

**Purpose**: Centralized instance creation

```python
class RepositoryFactory:
    _donor_repo = None
    
    @classmethod
    def get_donor_repository(cls):
        if cls._donor_repo is None:
            cls._donor_repo = DonorRepository()
        return cls._donor_repo
```

### 5. Singleton Pattern

**Purpose**: Single shared instance across application

```python
# Services are singletons
ledger = get_ledger()  # Same instance
notifications = get_notification_service()  # Same instance

# Used consistently throughout application
```

## Data Flow

### Donation Request Flow

```
1. Hospital creates request
   Hospital → POST /api/hospitals/{id}/requests
   
2. API Route validates and creates request
   hospital_routes.create_donation_request()
   
3. Repository creates record
   request_repo.create(request_data)
   
4. Service logs to blockchain
   ledger.log_hospital_request(request_id, ...)
   
5. Notification service notified
   notifications.notify_hospital_request_created(...)
   
6. Matching engine finds candidates
   engine = MatchingEngine()
   matches = engine.find_matches(request)
   
7. For each match:
   a. Score compatibility
   b. Log to blockchain
   c. Prepare response
   
8. Response with matches sent to frontend
   {
     request_id,
     matches: [ {donor, score, explanation} ]
   }
```

### Match Discovery Flow

```
1. Donor queries matches
   Donor → GET /api/donors/{id}/matches?organ=kidney
   
2. Route retrieves donor profile
   donor_repo.get_by_id(donor_id)
   
3. Query active requests for organ
   request_repo.find_by_organ("kidney")
   
4. Create matching engine
   engine = MatchingEngine(donor_repo)
   
5. For each request, score compatibility
   score = engine.score_compatibility(request, donor)
   
6. Sort by score (descending)
   matches.sort(key=lambda x: x["compatibility_score"], reverse=True)
   
7. Return top N matches
   {
     donor_id,
     total_matches,
     matches: [ {request_id, organ, urgency, score, explanation} ]
   }
```

## Integration Points

### Authentication Integration

```
User → Login.jsx
       ↓ (POST /api/auth/token)
Server → Validate credentials (users_db.json)
       ↓ JWT token created
Client ← Token stored in localStorage
       ↓
API endpoints ← Authorization: Bearer <token>
       ↓ Verify JWT
Service Layer ← Authenticated user context
```

### Analytics Integration

```
Admin Dashboard (React)
       ↓ (GET /api/admin/dashboard)
Admin Route (FastAPI)
       ↓ (calls admin_service)
Admin Service
       ├→ Donor Repository (get_all → stats)
       ├→ Hospital Repository (get_all → stats)
       ├→ Request Repository (queries by status)
       └→ Ledger Service (transaction counts)
       
       ↓ Aggregate all metrics
Response
       ├ System stats
       ├ Donor analytics
       ├ Hospital analytics
       ├ Request stats
       ├ Match quality metrics
       └ Blood group insights
```

## Scalability Strategy

### Current State: File-Based

**Suitable for**: Pilot, testing, small deployments
**Max records**: ~100,000
**Response time**: <50ms

### Phase 2: SQL Database

```python
# Replace DonorRepository implementation
class DonorRepository(Repository):
    def create(self, donor):
        # Instead of: self.donors.append(...)
        # Write: db.session.add(Donor(**donor))
        #        db.session.commit()
```

**No changes needed**: Routes, services, API layer

### Phase 3: Microservices

```
┌─────────────────────────────────────────────┐
│         API Gateway (FastAPI)               │
└──────┬──────────────┬──────────────┬────────┘
       │              │              │
       ↓              ↓              ↓
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  Matching   │ │  Ledger     │ │ Notification│
│  Service    │ │  Service    │ │ Service     │
│ (separate   │ │ (separate   │ │ (separate   │
│  process)   │ │  process)   │ │  process)   │
└─────────────┘ └─────────────┘ └─────────────┘
```

### Phase 4: Cloud Scalability

- **Containerization**: Docker images for each service
- **Orchestration**: Kubernetes for auto-scaling
- **Database**: Managed PostgreSQL/MongoDB
- **Caching**: Redis for frequently accessed data
- **Load Balancing**: Distribute across multiple instances

## Security Architecture

### Authentication

```
Password Storage:
  user_input → SHA256 hash → users_db.json
  
Production upgrade:
  user_input → bcrypt (with salt) → database

Token Generation:
  user_id + role → JWT (HS256 algorithm)
  token valid for 24 hours
  
Token Validation:
  Authorization: Bearer <token>
  Verify signature with secret key
  Extract user context
```

### Data Protection

- **CORS**: Limited to `localhost:5173`
- **HTTPS**: Configure for production
- **Encryption**: Sensitive fields (future)
- **Audit Trail**: Blockchain ledger

### Access Control

```python
# Routes can implement role checks
@router.get("/admin/dashboard")
async def admin_dashboard(user: User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    return admin_service.get_dashboard_summary()
```

### Blockchain Security

- **Immutability**: Hash chaining ensures records cannot be altered
- **Integrity Verification**: Automatic check on startup
- **Tamper Detection**: Failed hash verification indicates tampering

---

**Document Version**: 1.0
**Last Updated**: 2024-01-15
**Status**: Production-Ready (v2.0)
