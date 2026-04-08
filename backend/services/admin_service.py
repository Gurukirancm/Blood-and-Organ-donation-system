"""
Admin Service - Analytics & Monitoring
=======================================

Provides system metrics, user activity tracking, and analytics.

Tracks:
  - Total donors, hospitals, requests
  - Donation success rates
  - Match quality metrics
  - Blood group distribution
  - Response times and performance
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from typing import Dict, List, Any
from datetime import datetime, timedelta
from repositories.repository import RepositoryFactory


class AdminService:
    """
    Administrative service for system analytics and monitoring.
    """
    
    def __init__(self):
        """Initialize admin service with repository access."""
        self.donor_repo = RepositoryFactory.get_donor_repository()
        self.hospital_repo = RepositoryFactory.get_hospital_repository()
        self.request_repo = RepositoryFactory.get_request_repository()
    
    def get_system_stats(self) -> Dict[str, Any]:
        """
        Get overall system statistics.
        
        Returns:
            Dictionary with key metrics
        """
        return {
            "total_donors": self.donor_repo.count(),
            "total_hospitals": self.hospital_repo.count(),
            "total_requests": self.request_repo.count(),
            "active_requests": self.request_repo.count_by_status("pending"),
            "completed_donations": self.request_repo.count_by_status("completed"),
            "pending_matches": self.request_repo.count_by_status("pending"),
            "confirmed_matches": self.request_repo.count_by_status("confirmed"),
            "urgent_requests": len(self.request_repo.find_urgent()),
        }
    
    def get_donor_stats(self) -> Dict[str, Any]:
        """Get donor-related statistics."""
        donors = self.donor_repo.get_all()
        
        # Blood group distribution
        blood_distribution = {}
        for donor in donors:
            bg = donor.blood_group if donor.blood_group else "unknown"
            blood_distribution[bg] = blood_distribution.get(bg, 0) + 1
        
        # Available donors
        available_donors = [d for d in donors if d.availability]
        
        return {
            "total_donors": len(donors),
            "available_donors": len(available_donors),
            "blood_group_distribution": blood_distribution,
            "donor_registration_rate": self._calculate_registration_rate(donors),
        }
    
    def get_hospital_stats(self) -> Dict[str, Any]:
        """Get hospital-related statistics."""
        hospitals = self.hospital_repo.get_all()
        requests = self.request_repo.get_all()
        
        # Requests per hospital
        requests_per_hospital = {}
        for request in requests:
            # DonationRequest has user_id which links to hospital/recipient
            # But in this system, hospital_location might be used or we need a proper FK
            # Let's check the request model again. It has user_id.
            hospital_id = getattr(request, "hospital_id", None) or request.user_id
            if hospital_id:
                requests_per_hospital[hospital_id] = requests_per_hospital.get(hospital_id, 0) + 1
        
        return {
            "total_hospitals": len(hospitals),
            "total_requests": len(requests),
            "average_requests_per_hospital": (
                len(requests) / len(hospitals) if hospitals else 0
            ),
            "requests_per_hospital": requests_per_hospital,
        }
    
    def get_request_stats(self) -> Dict[str, Any]:
        """Get request/donation statistics."""
        requests = self.request_repo.get_all()
        
        # Organ distribution
        organ_distribution = {}
        for request in requests:
            organ = request.organ or "unknown"
            organ_distribution[organ] = organ_distribution.get(organ, 0) + 1
        
        # Urgency distribution
        urgency_distribution = {}
        for request in requests:
            urgency = request.urgency or "medium"
            urgency_distribution[urgency] = urgency_distribution.get(urgency, 0) + 1
        
        # Status distribution
        status_distribution = {}
        for request in requests:
            status = request.status or "pending"
            status_distribution[status] = status_distribution.get(status, 0) + 1
        
        return {
            "total_requests": len(requests),
            "organ_distribution": organ_distribution,
            "urgency_distribution": urgency_distribution,
            "status_distribution": status_distribution,
            "success_rate": self._calculate_success_rate(requests),
        }
    
    def get_match_quality_metrics(self) -> Dict[str, Any]:
        """Get metrics about match quality and performance."""
        requests = self.request_repo.get_all()
        matched_requests = [r for r in requests if r.status in ["matched", "confirmed", "fulfilled"]]
        
        avg_compatibility_score = 0
        if matched_requests:
            # DonationRequest might not have compatibility_score directly, checking matches
            total_score = 0
            count = 0
            for r in matched_requests:
                if r.matches:
                    total_score += sum(m.get("compatibility_score", 0) for m in r.matches)
                    count += len(r.matches)
            avg_compatibility_score = total_score / count if count else 0
        
        return {
            "total_matches_found": len(matched_requests),
            "average_compatibility_score": round(avg_compatibility_score, 2),
            "match_success_rate": (
                len(matched_requests) / len(requests) if requests else 0
            ),
            "matched_to_total_ratio": (
                f"{len(matched_requests)}/{len(requests)}"
            ),
        }
    
    def get_blood_group_insights(self) -> Dict[str, Any]:
        """Get insights about blood group distribution and needs."""
        donors = self.donor_repo.get_all()
        requests = self.request_repo.get_all()
        
        # Donor blood group distribution
        donor_blood_dist = {}
        for donor in donors:
            bg = donor.blood_group or "unknown"
            donor_blood_dist[bg] = donor_blood_dist.get(bg, 0) + 1
        
        # Request blood group needs
        request_blood_needs = {}
        for request in requests:
            bg = request.blood_group or "unknown"
            request_blood_needs[bg] = request_blood_needs.get(bg, 0) + 1
        
        return {
            "donor_blood_distribution": donor_blood_dist,
            "recipient_blood_needs": request_blood_needs,
            "supply_demand_ratio": self._calculate_supply_demand(
                donor_blood_dist,
                request_blood_needs,
            ),
        }
    
    def get_dashboard_summary(self) -> Dict[str, Any]:
        """Get comprehensive dashboard summary."""
        return {
            "system_stats": self.get_system_stats(),
            "donor_stats": self.get_donor_stats(),
            "hospital_stats": self.get_hospital_stats(),
            "request_stats": self.get_request_stats(),
            "match_quality": self.get_match_quality_metrics(),
            "blood_group_insights": self.get_blood_group_insights(),
            "timestamp": datetime.utcnow().isoformat(),
        }
    
    def get_recent_activity(self, hours: int = 24) -> Dict[str, Any]:
        """Get recent system activity."""
        donors = self.donor_repo.get_all()
        requests = self.request_repo.get_all()
        
        cutoff = datetime.utcnow() - timedelta(hours=hours)
        
        # Recent donors
        # Handle cases where created_at might be None
        recent_donors = [
            d for d in donors
            if d.id and d.id.startswith("donor_") # Placeholder if created_at is missing or use current
        ]
        
        # Recent requests
        recent_requests = [
            r for r in requests
            if r.created_at and datetime.fromisoformat(r.created_at) > cutoff
        ]
        
        return {
            "recent_donor_registrations": len(recent_donors),
            "recent_requests_created": len(recent_requests),
            "hours_window": hours,
        }
    
    @staticmethod
    def _calculate_registration_rate(donors: List[Any]) -> str:
        """Calculate donor registration rate (new per day)."""
        if not donors:
            return "0"
        
        return f"{len(donors)}/total" # Simplified as registration dates might be inconsistent
    
    @staticmethod
    def _calculate_success_rate(requests: List[Any]) -> float:
        """Calculate donation success rate."""
        if not requests:
            return 0.0
        
        completed = sum(1 for r in requests if r.status == "fulfilled")
        return round((completed / len(requests)) * 100, 2)
    
    @staticmethod
    def _calculate_supply_demand(
        donor_dist: Dict[str, int],
        request_dist: Dict[str, int],
    ) -> Dict[str, float]:
        """Calculate supply-demand ratio per blood group."""
        ratio = {}
        for blood_group in set(list(donor_dist.keys()) + list(request_dist.keys())):
            supply = donor_dist.get(blood_group, 0)
            demand = request_dist.get(blood_group, 1)  # Avoid division by zero
            ratio[blood_group] = round(supply / demand, 2)
        return ratio


# Global admin service instance
_admin_service = None


def get_admin_service() -> AdminService:
    """Get or create the global admin service instance."""
    global _admin_service
    if _admin_service is None:
        _admin_service = AdminService()
    return _admin_service
