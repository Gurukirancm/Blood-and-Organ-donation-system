from pydantic import BaseModel, Field
from typing import Optional, Annotated
from datetime import date


BloodGroup = Annotated[str, Field(pattern=r"^(A|B|AB|O)[+-]$")]
PhoneType = Annotated[str, Field(pattern=r"^\+?\d{7,15}$")]


NameType = Annotated[str, Field(min_length=1, example="John Doe")]
AgeType = Annotated[int, Field(ge=0, le=120, example=30)]


class Donor(BaseModel):
    id: Optional[str] = None
    user_id: str  # Link to Auth User
    name: NameType
    age: AgeType
    blood_group: BloodGroup
    organ: Annotated[str, Field(min_length=2, example="Kidney")]
    phone: PhoneType
    location: Annotated[str, Field(min_length=2, example="Mumbai")]
    last_donation: Optional[date] = Field(None, example="2024-12-01")
    availability: bool = True
