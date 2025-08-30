export interface User {
  id: number;
  username: string;
  email: string;
  bio?: string;
  created_at: string;
  is_active: boolean;
}

export interface Post {
  id: number;
  title?: string;
  content: string;
  image_url?: string;
  author_id: number;
  created_at: string;
  updated_at?: string;
  author: User;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  bio?: string;
}

export interface PostCreate {
  title?: string;
  content: string;
  image_url?: string;
}

export interface PostUpdate {
  title?: string;
  content?: string;
  image_url?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}
