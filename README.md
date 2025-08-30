# radar - Tumblr-like Application

A full-stack web application similar to Tumblr with user and post management capabilities.

## Features

### User Management
- Create new account / Sign up
- View profile
- Edit bio
- Delete account

### Post Management
- Create new posts with text and images
- View feed
- View other users' profiles

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **Design**: Black and white, Japanese minimalistic design

## Project Structure

```
radar/
├── frontend/          # React frontend
├── backend/           # FastAPI backend
├── database/          # Database migrations and schemas
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.8+)
- PostgreSQL
- pip (Python package manager)

### Installation

1. Clone the repository
2. Set up the backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```

4. Configure the database and environment variables
5. Run the application

## Development

- Backend runs on: http://localhost:8000
- Frontend runs on: http://localhost:3000
- API documentation: http://localhost:8000/docs
