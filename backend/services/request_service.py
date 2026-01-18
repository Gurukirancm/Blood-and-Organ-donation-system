from typing import List, Optional
from models.request import DonationRequest
from repositories.request_repository import RequestRepository
from services.matching_service import MatchingService
from datetime import datetime

class RequestService:
    def __init__(self):
        self.repository = RequestRepository()
        self.matching_service = MatchingService()

    def create_request(self, request: DonationRequest, user_id: str) -> DonationRequest:
        """
        Handle request creation and immediately trigger AI matching.
        """
        # 1. Prepare data
        request_data = request.dict(exclude={'id', 'matches', 'created_at'})
        request_data['user_id'] = user_id
        request_data['status'] = 'pending'
        request_data['created_at'] = datetime.now().isoformat()
        
        # 2. Save to database
        created_request = self.repository.create(DonationRequest(**request_data))
        request_id = str(created_request.id)
        
        # 3. Synchronously run matching logic
        # For production, this could be backgrounded if it's too slow.
        matches = self.matching_service.find_matches_for_request(request_id)
        
        # 4. Update request with matches
        status = 'matched' if matches else 'pending'
        updated_request = self.repository.update(request_id, {
            "matches": matches,
            "status": status
        })
        
        return updated_request

    def list_requests(self, filter_query: dict = None) -> List[DonationRequest]:
        return self.repository.get_multi(filter_query=filter_query)

    def get_request_by_id(self, request_id: str) -> Optional[DonationRequest]:
        return self.repository.get(request_id)
