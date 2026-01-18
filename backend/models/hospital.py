from pydantic import BaseModel, Field
from typing import Annotated


PhoneType = Annotated[str, Field(pattern=r"^\+?\d{7,15}$")]


class Hospital(BaseModel):
    hospital_name: Annotated[str, Field(min_length=1, example="City General Hospital")]
    city: Annotated[str, Field(min_length=1, example="Bengaluru")]
    contact_number: PhoneType
