import axios from 'axios';
import { User, Post, UserCreate, UserUpdate, PostCreate, PostUpdate, LoginCredentials, AuthResponse } from '../types';

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response = await api.post('/auth/token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Users API
export const usersAPI = {
  createUser: async (userData: UserCreate): Promise<User> => {
    const response = await api.post('/users/', userData);
    return response.data;
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data;
  },
  
  updateUser: async (userData: UserUpdate): Promise<User> => {
    const response = await api.put('/users/me', userData);
    return response.data;
  },
  
  deleteUser: async (): Promise<void> => {
    await api.delete('/users/me');
  },
  
  getUser: async (userId: number): Promise<User> => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
};

// Posts API
export const postsAPI = {
  createPostForm: async (form: FormData): Promise<Post> => {
    const response = await api.post('/posts/', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  createPost: async (postData: PostCreate): Promise<Post> => {
    const response = await api.post('/posts/', postData);
    return response.data;
  },
  
  getPosts: async (skip = 0, limit = 100): Promise<Post[]> => {
    const response = await api.get(`/posts/?skip=${skip}&limit=${limit}`);
    return response.data;
  },
  
  getPost: async (postId: number): Promise<Post> => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },
  
  updatePost: async (postId: number, postData: PostUpdate): Promise<Post> => {
    const response = await api.put(`/posts/${postId}`, postData);
    return response.data;
  },
  
  deletePost: async (postId: number): Promise<void> => {
    await api.delete(`/posts/${postId}`);
  },
  
  getUserPosts: async (userId: number): Promise<Post[]> => {
    const response = await api.get(`/posts/user/${userId}`);
    return response.data;
  },
};
