"""
Repository Layer - Data Access Abstraction
============================================

Provides clean data access layer for all database operations.

This abstraction allows:
  - Easy switching between database backends (MongoDB, PostgreSQL, SQLite)
  - Testable code with mock repositories
  - Centralized query logic
  - Consistent error handling

Current implementation: File-based storage with JSON
Future: Migrate to SQLAlchemy/MongoDB as needed
"""

import json
from typing import List, Dict, Optional, Any
from pathlib import Path
from datetime import datetime


class Repository:
    """Base repository class for data access patterns."""
    
    pass


class DonorRepository(Repository):
    """Repository for donor data access."""
    
    DONORS_FILE = Path(__file__).parent.parent / "donors.json"
    
    def __init__(self):
        """Initialize donor repository."""
        self.donors = self._load_donors()
    
    def _load_donors(self) -> List[Dict]:
        """Load donors from persistent storage."""
        if self.DONORS_FILE.exists():
            try:
                with open(self.DONORS_FILE, 'r') as f:
                    return json.load(f)
            except Exception:
                return []
        return []
    
    def _save_donors(self):
        """Persist donors to storage."""
        with open(self.DONORS_FILE, 'w') as f:
            json.dump(self.donors, f, indent=2)
    
    def create(self, donor: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new donor record.
        
        Args:
            donor: Donor data (email, blood_group, organs, health_status, etc.)
        
        Returns:
            Created donor with ID and timestamp
        """
        donor_id = f"donor_{len(self.donors) + 1}"
        donor_record = {
            "id": donor_id,
            "created_at": datetime.utcnow().isoformat(),
            **donor,
        }
        self.donors.append(donor_record)
        self._save_donors()
        return donor_record
    
    def get_by_id(self, donor_id: str) -> Optional[Dict]:
        """Retrieve donor by ID."""
        for donor in self.donors:
            if donor.get("id") == donor_id:
                return donor
        return None
    
    def get_by_email(self, email: str) -> Optional[Dict]:
        """Retrieve donor by email."""
        for donor in self.donors:
            if donor.get("email") == email:
                return donor
        return None
    
    def find_by_blood_group(self, blood_group: str) -> List[Dict]:
        """Find donors with specific blood group."""
        return [d for d in self.donors if d.get("blood_group") == blood_group]
    
    def find_by_organ(self, organ: str) -> List[Dict]:
        """Find donors willing to donate specific organ."""
        return [
            d for d in self.donors
            if organ in d.get("available_organs", [])
        ]
    
    def find_available(self, organ: str = None, blood_group: str = None) -> List[Dict]:
        """
        Find available donors.
        
        Args:
            organ: Optional organ filter
            blood_group: Optional blood group filter
        
        Returns:
            List of matching donors
        """
        candidates = [
            d for d in self.donors
            if d.get("is_available", True) and d.get("status") != "inactive"
        ]
        
        if organ:
            candidates = [d for d in candidates if organ in d.get("available_organs", [])]
        
        if blood_group:
            candidates = [d for d in candidates if d.get("blood_group") == blood_group]
        
        return candidates
    
    def find_by_health_status(self, status: str) -> List[Dict]:
        """Find donors with specific health status."""
        return [d for d in self.donors if d.get("health_status") == status]
    
    def update(self, donor_id: str, updates: Dict[str, Any]) -> Optional[Dict]:
        """Update donor record."""
        for donor in self.donors:
            if donor.get("id") == donor_id:
                donor.update(updates)
                donor["updated_at"] = datetime.utcnow().isoformat()
                self._save_donors()
                return donor
        return None
    
    def delete(self, donor_id: str) -> bool:
        """Delete donor record."""
        for i, donor in enumerate(self.donors):
            if donor.get("id") == donor_id:
                self.donors.pop(i)
                self._save_donors()
                return True
        return False
    
    def get_all(self) -> List[Dict]:
        """Get all donors."""
        return self.donors
    
    def count(self) -> int:
        """Get total donor count."""
        return len(self.donors)


class HospitalRepository(Repository):
    """Repository for hospital data access."""
    
    HOSPITALS_FILE = Path(__file__).parent.parent / "hospitals.json"
    
    def __init__(self):
        """Initialize hospital repository."""
        self.hospitals = self._load_hospitals()
    
    def _load_hospitals(self) -> List[Dict]:
        """Load hospitals from persistent storage."""
        if self.HOSPITALS_FILE.exists():
            try:
                with open(self.HOSPITALS_FILE, 'r') as f:
                    return json.load(f)
            except Exception:
                return []
        return []
    
    def _save_hospitals(self):
        """Persist hospitals to storage."""
        with open(self.HOSPITALS_FILE, 'w') as f:
            json.dump(self.hospitals, f, indent=2)
    
    def create(self, hospital: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new hospital record."""
        hospital_id = f"hospital_{len(self.hospitals) + 1}"
        hospital_record = {
            "id": hospital_id,
            "created_at": datetime.utcnow().isoformat(),
            **hospital,
        }
        self.hospitals.append(hospital_record)
        self._save_hospitals()
        return hospital_record
    
    def get_by_id(self, hospital_id: str) -> Optional[Dict]:
        """Retrieve hospital by ID."""
        for hospital in self.hospitals:
            if hospital.get("id") == hospital_id:
                return hospital
        return None
    
    def get_by_email(self, email: str) -> Optional[Dict]:
        """Retrieve hospital by email."""
        for hospital in self.hospitals:
            if hospital.get("email") == email:
                return hospital
        return None
    
    def get_all(self) -> List[Dict]:
        """Get all hospitals."""
        return self.hospitals
    
    def update(self, hospital_id: str, updates: Dict[str, Any]) -> Optional[Dict]:
        """Update hospital record."""
        for hospital in self.hospitals:
            if hospital.get("id") == hospital_id:
                hospital.update(updates)
                hospital["updated_at"] = datetime.utcnow().isoformat()
                self._save_hospitals()
                return hospital
        return None
    
    def count(self) -> int:
        """Get total hospital count."""
        return len(self.hospitals)


class DonationRequestRepository(Repository):
    """Repository for donation request data access."""
    
    REQUESTS_FILE = Path(__file__).parent.parent / "donation_requests.json"
    
    def __init__(self):
        """Initialize donation request repository."""
        self.requests = self._load_requests()
    
    def _load_requests(self) -> List[Dict]:
        """Load requests from persistent storage."""
        if self.REQUESTS_FILE.exists():
            try:
                with open(self.REQUESTS_FILE, 'r') as f:
                    return json.load(f)
            except Exception:
                return []
        return []
    
    def _save_requests(self):
        """Persist requests to storage."""
        with open(self.REQUESTS_FILE, 'w') as f:
            json.dump(self.requests, f, indent=2)
    
    def create(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new donation request."""
        request_id = f"request_{len(self.requests) + 1}"
        request_record = {
            "id": request_id,
            "created_at": datetime.utcnow().isoformat(),
            "status": "pending",
            **request,
        }
        self.requests.append(request_record)
        self._save_requests()
        return request_record
    
    def get_by_id(self, request_id: str) -> Optional[Dict]:
        """Retrieve request by ID."""
        for req in self.requests:
            if req.get("id") == request_id:
                return req
        return None
    
    def get_by_hospital(self, hospital_id: str) -> List[Dict]:
        """Get all requests from a hospital."""
        return [r for r in self.requests if r.get("hospital_id") == hospital_id]
    
    def find_active(self) -> List[Dict]:
        """Find active (pending/matched) requests."""
        return [
            r for r in self.requests
            if r.get("status") in ["pending", "matched", "confirmed"]
        ]
    
    def find_by_urgency(self, urgency: str) -> List[Dict]:
        """Find requests with specific urgency level."""
        return [r for r in self.requests if r.get("urgency") == urgency]
    
    def find_by_organ(self, organ: str) -> List[Dict]:
        """Find requests for specific organ."""
        return [r for r in self.requests if r.get("organ") == organ]
    
    def find_urgent(self) -> List[Dict]:
        """Find all urgent requests."""
        return self.find_by_urgency("urgent")
    
    def update(self, request_id: str, updates: Dict[str, Any]) -> Optional[Dict]:
        """Update request record."""
        for req in self.requests:
            if req.get("id") == request_id:
                req.update(updates)
                req["updated_at"] = datetime.utcnow().isoformat()
                self._save_requests()
                return req
        return None
    
    def update_status(self, request_id: str, new_status: str) -> Optional[Dict]:
        """Update request status."""
        return self.update(request_id, {"status": new_status})
    
    def get_all(self) -> List[Dict]:
        """Get all requests."""
        return self.requests
    
    def count(self) -> int:
        """Get total request count."""
        return len(self.requests)
    
    def count_by_status(self, status: str) -> int:
        """Count requests with specific status."""
        return sum(1 for r in self.requests if r.get("status") == status)


class RepositoryFactory:
    """Factory for repository instances."""
    
    _donor_repo = None
    _hospital_repo = None
    _request_repo = None
    
    @classmethod
    def get_donor_repository(cls) -> DonorRepository:
        """Get or create donor repository singleton."""
        if cls._donor_repo is None:
            cls._donor_repo = DonorRepository()
        return cls._donor_repo
    
    @classmethod
    def get_hospital_repository(cls) -> HospitalRepository:
        """Get or create hospital repository singleton."""
        if cls._hospital_repo is None:
            cls._hospital_repo = HospitalRepository()
        return cls._hospital_repo
    
    @classmethod
    def get_request_repository(cls) -> DonationRequestRepository:
        """Get or create request repository singleton."""
        if cls._request_repo is None:
            cls._request_repo = DonationRequestRepository()
        return cls._request_repo
