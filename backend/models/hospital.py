from pydantic import BaseModel, Field
from typing import Annotated


PhoneType = Annotated[str, Field(pattern=r"^\+?\d{7,15}$")]


class Hospital(BaseModel):
    hospital_name: str = Field(..., min_length=1, example="City General Hospital")
    city: str = Field(..., min_length=1, example="Bengaluru")
    contact_number: str = Field(..., pattern=r"^\+?\d{7,15}$")
    email: str = Field(..., example="hospital@example.com")
    address: str = Field(None, example="123 Health St")
    is_active: bool = Field(True, example=True)

class HospitalCreate(Hospital):
    password: str = Field(..., min_length=6, example="password123")
