from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from services.auth_service import AuthService
from core.config import settings
from jose import jwt, JWTError
import logging

auth_router = APIRouter()
auth_service = AuthService()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/token")

class UserCreate(BaseModel):
    email: str
    password: str
    role: str = "donor"

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class UserResponse(BaseModel):
    id: str
    email: str
    role: str

from models.response import success_response, error_response

@auth_router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate):
    try:
        auth_service.register_user(user.email, user.password, user.role)
        return success_response(message="User registered successfully")
    except ValueError as e:
        return error_response(message=str(e), code=400)
    except Exception as e:
        logging.error(f"Registration error: {e}")
        return error_response(message="Internal server error", code=500)

@auth_router.post("/token", response_model=Token)
def login(email: str, password: str):
    user = auth_service.authenticate_user(email, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth_service.create_access_token(data={"sub": user.email, "role": user.role})
    refresh_token = auth_service.create_refresh_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@auth_router.post("/refresh", response_model=Token)
def refresh_token(refresh_token: str):
    payload = auth_service.decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    email = payload.get("sub")
    role = payload.get("role")
    
    # In a real app we might check if user still exists or is active
    
    new_access_token = auth_service.create_access_token(data={"sub": email, "role": role})
    # We can rotate refresh tokens too if we want
    new_refresh_token = auth_service.create_refresh_token(data={"sub": email, "role": role})
    
    return {"access_token": new_access_token, "refresh_token": new_refresh_token, "token_type": "bearer"}


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = auth_service.decode_token(token)
    if not payload or payload.get("type") != "access": # Enforce access token type
        raise credentials_exception
        
    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception
    
    user = auth_service.user_repo.get_by_email(email)
    if user is None:
        raise credentials_exception
    return user

@auth_router.get("/me", response_model=UserResponse)
def read_users_me(current_user = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "role": current_user.role
    }

class RoleChecker:
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user = Depends(get_current_user)):
        if current_user.role not in self.allowed_roles:
            raise HTTPException(status_code=403, detail="Operation not permitted")
        return current_user
