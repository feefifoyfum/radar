from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from typing import List
from schemas import PostCreate, Post as PostSchema, PostUpdate
from auth import get_current_active_user
from supabase_client import get_supabase

router = APIRouter(prefix="/posts", tags=["posts"])

@router.post("/", response_model=PostSchema)
def create_post(
    title: str | None = Form(None),
    content: str = Form(...),
    file: UploadFile | None = File(None),
    current_user: dict = Depends(get_current_active_user),
):
    image_url = None
    if file is not None:
        import os, uuid
        os.makedirs("uploads", exist_ok=True)
        ext = os.path.splitext(file.filename)[1].lower()
        filename = f"{uuid.uuid4().hex}{ext}"
        path = os.path.join("uploads", filename)
        with open(path, "wb") as f:
            f.write(file.file.read())
        image_url = f"/uploads/{filename}"
    sb = get_supabase()
    inserted = sb.table("posts").insert({
        "title": title,
        "content": content,
        "image_url": image_url,
        "author_id": current_user.get("id"),
    }).select("*").execute()
    if not inserted.data:
        raise HTTPException(status_code=500, detail="Failed to create post")
    post = inserted.data[0]
    # attach author
    author = current_user
    post["author"] = {
        "id": author.get("id"),
        "username": author.get("username"),
        "email": author.get("email"),
        "bio": author.get("bio"),
        "created_at": author.get("created_at"),
        "is_active": author.get("is_active", True),
    }
    return post

@router.get("/", response_model=List[PostSchema])
def get_posts(skip: int = 0, limit: int = 100):
    sb = get_supabase()
    res = sb.table("posts").select("*", count="exact").order("created_at", desc=True).range(skip, skip + max(limit - 1, 0)).execute()
    posts = res.data or []
    # fetch authors in batch
    author_ids = sorted({p.get("author_id") for p in posts if p.get("author_id") is not None})
    authors_map = {}
    if author_ids:
        authors_res = sb.table("users").select("id, username, email, bio, created_at, is_active").in_("id", author_ids).execute()
        for u in (authors_res.data or []):
            authors_map[u["id"]] = u
    for p in posts:
        p["author"] = authors_map.get(p.get("author_id"))
    return posts

@router.get("/{post_id}", response_model=PostSchema)
def get_post(post_id: int):
    sb = get_supabase()
    res = sb.table("posts").select("*").eq("id", post_id).limit(1).execute()
    posts = res.data or []
    if len(posts) == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    post = posts[0]
    author_res = sb.table("users").select("id, username, email, bio, created_at, is_active").eq("id", post.get("author_id")).limit(1).execute()
    author = (author_res.data or [None])[0]
    post["author"] = author
    return post

@router.put("/{post_id}", response_model=PostSchema)
def update_post(
    post_id: int,
    post_update: PostUpdate,
    current_user: dict = Depends(get_current_active_user),
):
    sb = get_supabase()
    res = sb.table("posts").select("author_id").eq("id", post_id).limit(1).execute()
    posts = res.data or []
    if len(posts) == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    if posts[0].get("author_id") != current_user.get("id"):
        raise HTTPException(status_code=403, detail="Not authorized to update this post")

    update_data = {k: v for k, v in post_update.dict(exclude_unset=True).items() if v is not None}
    updated = sb.table("posts").update(update_data).eq("id", post_id).select("*").execute()
    if not updated.data:
        raise HTTPException(status_code=500, detail="Failed to update post")
    post = updated.data[0]
    author_res = sb.table("users").select("id, username, email, bio, created_at, is_active").eq("id", post.get("author_id")).limit(1).execute()
    post["author"] = (author_res.data or [None])[0]
    return post

@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    current_user: dict = Depends(get_current_active_user),
):
    sb = get_supabase()
    res = sb.table("posts").select("author_id").eq("id", post_id).limit(1).execute()
    posts = res.data or []
    if len(posts) == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    if posts[0].get("author_id") != current_user.get("id"):
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    deleted = sb.table("posts").delete().eq("id", post_id).execute()
    if deleted.count is None and (deleted.data is None or len(deleted.data) == 0):
        raise HTTPException(status_code=500, detail="Failed to delete post")
    return {"message": "Post deleted successfully"}

@router.get("/user/{user_id}", response_model=List[PostSchema])
def get_user_posts(user_id: int):
    sb = get_supabase()
    user_res = sb.table("users").select("id").eq("id", user_id).eq("is_active", True).limit(1).execute()
    if not (user_res.data or []):
        raise HTTPException(status_code=404, detail="User not found")
    res = sb.table("posts").select("*").eq("author_id", user_id).order("created_at", desc=True).execute()
    posts = res.data or []
    # include author
    for p in posts:
        p["author"] = (user_res.data or [None])[0]
    return posts
