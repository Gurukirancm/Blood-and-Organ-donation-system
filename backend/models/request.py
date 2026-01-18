from pydantic import BaseModel, Field
from typing import Literal, Annotated, List, Optional


BloodGroup = Annotated[str, Field(pattern=r"^(A|B|AB|O)[+-]$")]


class DonationRequest(BaseModel):
    id: Optional[str] = None
    user_id: str  # Link to Recipient
    blood_group: BloodGroup
    organ: Annotated[str, Field(min_length=2, example="Liver")]
    urgency: Literal["low", "medium", "high", "critical"]
    health_condition: Optional[str] = None
    status: Literal["pending", "matched", "fulfilled"] = "pending"
    matches: List[dict] = []
    created_at: Optional[str] = None
