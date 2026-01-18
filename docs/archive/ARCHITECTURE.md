# System Architecture & API Documentation

## 1. System Overview
The **Smart Blood and Organ Donation Management System** is a mission-critical healthcare application designed to facilitate the rapid and secure matching of donors to recipients. It employs a **Service-Oriented Architecture (SOA)** to ensure scalability, maintainability, and security.

### 1.1 High-Level Architecture
[Frontend (React)] <--> [API Layer (FastAPI)] <--> [Service Layer] <--> [Data Layer (Repositories)] <--> [MongoDB]
                                                       |
                                                       v
                                                 [Blockchain Ledger]

## 2. Backend Design Layers

### 2.1 API Layer (`routes/`)
- **Purpose**: Handles incoming HTTP requests, performs input validation (Pydantic), and routes data to the appropriate service.
- **Components**:
  - `auth_routes.py`: Login, Registration, JWT Token generation.
  - `donor_routes.py`: Donor profile management.
  - `request_routes.py`: Recipient requests and AI matching triggers.
  - `admin_routes.py`: System audit and analytics.
  - `notification_routes.py`: User alerting.

### 2.2 Service Layer (`services/`)
- **Purpose**: Encapsulates core business logic.
- **Components**:
  - `AuthService`: Password hashing (Bcrypt), Token signing (HS256).
  - `DonorService`: Orchestrates donor registration and blockchain logging.
  - `MatchingService`: Implementation of the AI matching algorithm.
  - `BlockchainService`: Interface for the local ledger.
  - `NotificationService`: Abstraction for Email/SMS delivery.

### 2.3 Repository Layer (`repositories/`)
- **Purpose**: Abstracts direct database access, providing a clean interface for CRUD operations.
- **Pattern**: `BaseRepository` (Generic) -> `DonorRepository`, `UserRepository`, `RequestRepository`.

## 3. Core Modules

### 3.1 AI Matching Engine
- **Logic**: Weighted scoring algorithm.
- **Factors**:
  - Blood Type Compatibility (Critical)
  - Organ Type Match (Critical)
  - Urgency Level (High=3x weight, Medium=2x, Low=1x)
  - Geographic Proximity
- **Determinism**: The algorithm is deterministic to ensure fairness and auditability.

### 3.2 Blockchain Ledger
- **Type**: Local Hash-Chained Ledger (Linked List with Crypto Hash).
- **Structure**:
  ```json
  {
    "index": 1,
    "timestamp": "ISO8601",
    "data": { "event": "DONOR_REG", "id": "..." },
    "previous_hash": "a1b2...",
    "hash": "c3d4..."
  }
  ```
- **Integrity**: Any modification to a past block invalidates the hash chain of all subsequent blocks.

## 4. API Specification

### Authentication
- **POST** `/api/auth/token`: Login. Returns `access_token`.
- **POST** `/api/auth/register`: Register new user.
- **GET** `/api/auth/me`: Get current user profile.

### Donors
- **GET** `/api/donors/`: List all donors (Hospital/Admin only).
- **POST** `/api/donors/`: Register a new donor profile.

### Requests & Matching
- **GET** `/api/requests`: View requests.
- **POST** `/api/requests`: Create a new organ request.
- **POST** `/api/requests/match`: **(Hospital Only)** Trigger AI matching for a specific request.

### Admin & Audit
- **GET** `/api/admin/audit-trail`: Fetch full blockchain history.
- **GET** `/api/admin/integrity-check`: Verify ledger cryptographic integrity.

## 5. Security Protocols
- **Transport**: HTTPS (Production) / HTTP (Dev).
- **Data at Rest**: Passwords salted and hashed with Bcrypt.
- **Authorization**: Strict Role-Based Access Control (RBAC) on all protected routes.
