from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class User(BaseModel):
    id: Optional[str] = None
    email: EmailStr
    password_hash: str
    role: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
