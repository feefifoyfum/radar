from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from schemas import UserCreate, User as UserSchema, UserUpdate
from auth import get_password_hash, get_current_active_user
from supabase_client import get_supabase

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserSchema)
def create_user(user: UserCreate):
    sb = get_supabase()
    existing_email = sb.table("users").select("id").eq("email", user.email).execute()
    if (existing_email.data or []) != []:
        raise HTTPException(status_code=400, detail="Email already registered")
    existing_username = sb.table("users").select("id").eq("username", user.username).execute()
    if (existing_username.data or []) != []:
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed_password = get_password_hash(user.password)
    inserted = sb.table("users").insert({
        "email": user.email,
        "username": user.username,
        "hashed_password": hashed_password,
        "is_active": True,
    }).select("*").execute()
    if not inserted.data:
        raise HTTPException(status_code=500, detail="Failed to create user")
    return inserted.data[0]

@router.get("/me", response_model=UserSchema)
def read_users_me(current_user: dict = Depends(get_current_active_user)):
    return current_user

@router.put("/me", response_model=UserSchema)
def update_user(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_active_user),
):
    sb = get_supabase()
    user_id = current_user.get("id")
    updates = {}
    if user_update.username:
        exists = sb.table("users").select("id").eq("username", user_update.username).neq("id", user_id).execute()
        if (exists.data or []) != []:
            raise HTTPException(status_code=400, detail="Username already taken")
        updates["username"] = user_update.username
    if user_update.email:
        exists = sb.table("users").select("id").eq("email", user_update.email).neq("id", user_id).execute()
        if (exists.data or []) != []:
            raise HTTPException(status_code=400, detail="Email already registered")
        updates["email"] = user_update.email
    if user_update.bio is not None:
        updates["bio"] = user_update.bio

    if updates == {}:
        return current_user

    updated = sb.table("users").update(updates).eq("id", user_id).select("*").execute()
    if not updated.data:
        raise HTTPException(status_code=500, detail="Failed to update user")
    return updated.data[0]

@router.delete("/me")
def delete_user(
    current_user: dict = Depends(get_current_active_user),
):
    sb = get_supabase()
    user_id = current_user.get("id")
    res = sb.table("users").update({"is_active": False}).eq("id", user_id).execute()
    if res.data is None:
        raise HTTPException(status_code=500, detail="Failed to deactivate user")
    return {"message": "User deleted successfully"}

@router.get("/{user_id}", response_model=UserSchema)
def get_user(user_id: int):
    sb = get_supabase()
    res = sb.table("users").select("*").eq("id", user_id).eq("is_active", True).limit(1).execute()
    users = res.data or []
    if len(users) == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return users[0]
