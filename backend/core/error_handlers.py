from fastapi import Request, status
from fastapi.responses import JSONResponse
import logging
from datetime import datetime

class AppError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code

async def app_exception_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "message": exc.message,
            "data": None,
            "meta": {
                "timestamp": datetime.now().isoformat(),
                "error_code": exc.status_code
            }
        },
    )

async def generic_exception_handler(request: Request, exc: Exception):
    logging.getLogger("uvicorn.error").error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "error",
            "message": "Internal Server Error. Please contact support.",
            "data": None,
            "meta": {
                "timestamp": datetime.now().isoformat(),
                "error_code": 500
            }
        },
    )
