from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import os
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

from ..database.session import get_db
from ..models.user import User

router = APIRouter()

# Security setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# JWT configuration
SECRET_KEY = os.getenv("JWT_SECRET", "9aa1fd7732d67bb8bae1ff2d90081eefdbba4668c852af3422ebddaecb80cab3")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# User registration schema
class UserRegistration(BaseModel):
    username: str
    email: str
    password: str
    full_name: Optional[str] = None

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/register")
async def register(
    user_data: UserRegistration,
    db: AsyncSession = Depends(get_db)
):
    """Register a new user"""
    # For now, just create a mock user to return
    # In a real implementation, you would validate and save the user data
    mock_user = {
        "id": 1,
        "username": user_data.username,
        "email": user_data.email,
        "full_name": user_data.full_name,
        "profile_photo": None
    }
    
    # Create access token
    token_data = {
        "sub": user_data.username,
        "email": user_data.email,
        "username": user_data.username,
        "full_name": user_data.full_name
    }
    access_token = create_access_token(token_data)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": mock_user
    }

@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """Login and receive JWT token"""
    # In a real implementation, you would validate user credentials
    mock_user = {
        "id": 1,
        "username": form_data.username,
        "email": form_data.username + "@example.com",  # Mock email
        "full_name": "Test User",
        "profile_photo": None
    }
    
    # Create access token
    token_data = {
        "sub": form_data.username,
        "email": mock_user["email"],
        "username": form_data.username,
        "full_name": mock_user["full_name"]
    }
    access_token = create_access_token(token_data)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": mock_user
    }

@router.post("/refresh")
async def refresh_token(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """Refresh JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        # Create a new token with updated expiration
        new_token = create_access_token(payload)
        return {
            "access_token": new_token, 
            "token_type": "bearer"
        }
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/logout")
async def logout(
    token: str = Depends(oauth2_scheme)
):
    """Logout (invalidate token)"""
    # In a real implementation, you might want to blacklist the token
    # For now, just return success
    return {"message": "Successfully logged out"}

@router.get("/me")
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """Get current user information"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username")
        email: str = payload.get("email")
        if username is None or email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        return {
            "id": payload.get("sub"),
            "username": username,
            "email": email,
            "full_name": payload.get("full_name")
        }
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )