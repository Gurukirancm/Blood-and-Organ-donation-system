# Smart Blood and Organ Donation Management System: A Secure, AI-Driven Healthcare Platform

## Abstract
This project implements a secure, decentralized, and AI-driven platform for managing blood and organ donations. It addresses the inefficiencies of traditional manual systems by introducing automation, transparency, and role-based access control. The system features a layered architecture with independent portals for Donors, Recipients, Hospitals, and Administrators, ensuring data privacy and operational efficiency. Key innovations include an AI-based matching engine for organ compatibility, an anonymized availability tracker for privacy, and a local blockchain ledger to ensure the immutability of donation records.

## Key Features
- **Multi-Role Architecture**: Distinct portals for Donors, Recipients, Hospitals, and Admins with strict Role-Based Access Control (RBAC).
- **AI Matching Engine**: Deterministic algorithm matching candidates based on blood group, organ type, urgency, and medical compatibility scores. Includes detailed explainability breakdowns.
- **Anonymized Availability**: Real-time analysis endpoint for recipients and hospitals to view stock levels without exposing donor identities.
- **Blockchain Ledger**: Immutable audit trail for all critical transactions (registrations, requests, matches) using SHA-256 hash chaining.
- **Real-Time Consistency**: Atomic "claiming" logic to prevent race conditions during fulfillment.
- **Secure Authentication**: JWT-based stateless authentication with Bcrypt password hashing.

## System Architecture
The system follows a strict Service-Oriented Architecture (SOA):
- **Frontend**: React.js with Vite.
- **Backend API**: FastAPI (Python) serving modularized REST endpoints.
- **Service Layer**: Business logic encapsulated in `DonorService`, `MatchingService`, `BlockchainService`, etc.
- **Data Access Layer**: Repository pattern abstracting MongoDB interactions.

## Installation & Setup

### Using Docker (Recommended)
1. Clone the repository.
2. Ensure you have Docker and Docker Compose installed.
3. Run the following command:
   ```bash
   docker-compose up --build
   ```
   The backend will start at `http://localhost:8000` and the frontend at `http://localhost:5173`.

### Manual Setup
Refer to individual `README.md` files in `backend/` and `frontend/` for manual dependency management and setup.

## API Documentation
| Method | Endpoint | Description | Role |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/token` | User Login (JWT) | All |
| POST | `/api/hospitals/fulfill/{id}` | Atomic Request Fulfillment | Hospital |
| GET | `/api/analysis/availability` | Anonymized Stock Analysis | Recipient/Hospital |
| GET | `/api/admin/audit-trail` | View Blockchain Ledger | Admin |

## License
MIT License
