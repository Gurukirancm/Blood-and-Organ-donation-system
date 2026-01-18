import os
from typing import List
try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Smart Blood & Organ Donation System"
    API_V1_STR: str = "/api/v1"
    
    # Database
    MONGO_URL: str = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    DB_NAME: str = os.getenv("DB_NAME", "blood_organ_db")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "DEVELOPMENT_INSECURE_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://0.0.0.0:5173"
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
