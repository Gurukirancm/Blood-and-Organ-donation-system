from pydantic import BaseModel, Field
from typing import Optional, Annotated
from datetime import date


BloodGroup = Annotated[str, Field(pattern=r"^(A|B|AB|O)[+-]$")]
PhoneType = Annotated[str, Field(pattern=r"^\+?\d{7,15}$")]


NameType = Annotated[str, Field(min_length=1, example="John Doe")]
AgeType = Annotated[int, Field(ge=0, le=120, example=30)]


class DonorModel(BaseModel):
    id: Optional[str] = None
    user_id: Optional[str] = None
    first_name: str = Field(min_length=1)
    last_name: str = Field(min_length=1)
    email: str = Field(pattern=r"^\S+@\S+\.\S+$")
    mobile: str = Field(pattern=r"^\+?\d{7,15}$")
    address: str = Field(min_length=5)
    blood_group: str = Field(pattern=r"^(A|B|AB|O)[+-]$")
    donate_blood: bool = True
    organs: list[str] = Field(default_factory=list)
    availability: bool = True
    last_donation: Optional[date] = None
    medical_history: Optional[str] = None
    health_status: Optional[str] = None
    consent_agreement: bool = False
    is_verified: bool = False

    class Config:
        arbitrary_types_allowed = True
