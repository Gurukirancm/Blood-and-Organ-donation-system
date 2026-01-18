from typing import List, Dict, Optional
from repositories.donor_repository import DonorRepository
from repositories.request_repository import RequestRepository
from services.blockchain_service import BlockchainService
from ai.advanced_matching import AdvancedDonorMatcher

class MatchingService:
    def __init__(self):
        self.donor_repository = DonorRepository()
        self.request_repository = RequestRepository()
        self.blockchain_service = BlockchainService()
        self.matcher = AdvancedDonorMatcher()

    def find_matches_for_request(self, request_id: str) -> List[Dict]:
        """
        Find best donor matches for a given request.
        Logs high-confidence matches to the blockchain.
        """
        # 1. Fetch Request
        request = self.request_repository.get(request_id)
        if not request:
            raise ValueError(f"Request with ID {request_id} not found")

        # 2. Fetch Potential Donors by organ
        donors = self.donor_repository.get_by_organ(request.organ)
        
        # Convert models to dicts for the AI module
        donor_dicts = []
        for d in donors:
            d_dict = d.dict()
            d_dict['id'] = str(d.id)
            donor_dicts.append(d_dict)

        request_dict = request.dict()
        request_dict['id'] = str(request.id)

        # 3. Running AI Matching
        matches = self.matcher.rank_donor_matches(
            donors=donor_dicts,
            recipient=request_dict,
            urgency=request.urgency,
            limit=5
        )

        # 4. Log meaningful matches to Blockchain
        for match in matches:
            if match.get('match_score', 0) > 0.8: # High confidence threshold
                try:
                    self.blockchain_service.log_match_found(
                        request_id=str(request_id),
                        donor_id=str(match.get('donor_id')),
                        compatibility_score=match.get('match_score')
                    )
                except Exception:
                    pass 

        return matches
