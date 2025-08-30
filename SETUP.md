# Foymblr Setup Guide

This guide will help you set up the Foymblr application on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **PostgreSQL** (v12 or higher)
- **Git**

## Database Setup

1. **Install PostgreSQL** (if not already installed):
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql postgresql-contrib`
   - Windows: Download from https://www.postgresql.org/download/windows/

2. **Start PostgreSQL service**:
   - macOS: `brew services start postgresql`
   - Ubuntu: `sudo systemctl start postgresql`
   - Windows: Start from Services

3. **Create the database**:
   ```bash
   # Connect to PostgreSQL as the postgres user
   sudo -u postgres psql
   
   # Run the schema file
   \i database/schema.sql
   
   # Exit PostgreSQL
   \q
   ```

## Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment**:
   ```bash
   python3 -m venv venv
   ```

3. **Activate the virtual environment**:
   ```bash
   # On macOS/Linux:
   source venv/bin/activate
   
   # On Windows:
   venv\Scripts\activate
   ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Configure environment variables**:
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit the .env file with your database credentials
   # Update DATABASE_URL, SECRET_KEY, etc.
   ```

6. **Start the backend server**:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The backend will be available at: http://localhost:8000
   API documentation: http://localhost:8000/docs

## Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

   The frontend will be available at: http://localhost:3000

## Quick Start Scripts

You can also use the provided scripts for easier setup:

1. **Start backend**:
   ```bash
   ./start_backend.sh
   ```

2. **Start frontend** (in a new terminal):
   ```bash
   ./start_frontend.sh
   ```

## Environment Configuration

Create a `.env` file in the `backend` directory with the following variables:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/foymblr
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Replace the values with your actual database credentials and a secure secret key.

## Features

Once the application is running, you can:

### User Management
- **Sign up**: Create a new account at http://localhost:3000/signup
- **Login**: Access your account at http://localhost:3000/login
- **View Profile**: See your profile and posts
- **Edit Profile**: Update your username, email, and bio
- **Delete Account**: Remove your account permanently

### Post Management
- **Create Posts**: Add new posts with text and optional images
- **View Feed**: See all posts from all users
- **View User Profiles**: Browse other users' profiles and posts
- **Delete Posts**: Remove your own posts

## API Endpoints

The backend provides the following main endpoints:

### Authentication
- `POST /auth/token` - Login and get access token

### Users
- `POST /users/` - Create new user
- `GET /users/me` - Get current user
- `PUT /users/me` - Update current user
- `DELETE /users/me` - Delete current user
- `GET /users/{user_id}` - Get user by ID

### Posts
- `POST /posts/` - Create new post
- `GET /posts/` - Get all posts (feed)
- `GET /posts/{post_id}` - Get specific post
- `PUT /posts/{post_id}` - Update post
- `DELETE /posts/{post_id}` - Delete post
- `GET /posts/user/{user_id}` - Get user's posts

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Ensure PostgreSQL is running
   - Check your DATABASE_URL in the .env file
   - Verify the database exists

2. **Port Already in Use**:
   - Backend: Change port in uvicorn command or kill existing process
   - Frontend: React will automatically suggest an alternative port

3. **CORS Errors**:
   - Ensure the backend is running on port 8000
   - Check that the frontend proxy is configured correctly

4. **Module Not Found Errors**:
   - Ensure you're in the correct virtual environment
   - Reinstall dependencies: `pip install -r requirements.txt`

### Getting Help

If you encounter issues:
1. Check the console logs for error messages
2. Verify all prerequisites are installed
3. Ensure all services are running
4. Check the API documentation at http://localhost:8000/docs
