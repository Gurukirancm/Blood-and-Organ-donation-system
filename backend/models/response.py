from typing import Any, Optional, Dict
from pydantic import BaseModel, Field
from datetime import datetime

class APIResponse(BaseModel):
    status: str = Field(..., example="success")
    message: Optional[str] = Field(None, example="Operation completed successfully")
    data: Optional[Any] = None
    meta: Dict[str, Any] = Field(default_factory=lambda: {
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0"
    })

def success_response(data: Any = None, message: str = "Success") -> Dict:
    return APIResponse(status="success", message=message, data=data).dict()

def error_response(message: str, code: int = 400) -> Dict:
    return APIResponse(status="error", message=message, data=None).dict()
