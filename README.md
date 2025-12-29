# Smart Job Tracker

A modern, full-stack job application tracking system built with React and FastAPI. Track your job applications, manage statuses, and monitor your job search progress with a beautiful, intuitive interface.

![Tech Stack](https://img.shields.io/badge/React-18.2-blue) ![Tech Stack](https://img.shields.io/badge/FastAPI-0.125-green) ![Tech Stack](https://img.shields.io/badge/TailwindCSS-3.0-38bdf8)

## ✨ Features

- 🔐 **User Authentication** - Secure login and registration with JWT tokens
- 📊 **Dashboard** - View statistics and manage all your job applications
- ➕ **Add Jobs** - Quickly add new job applications
- 📈 **Status Tracking** - Track applications through stages: Applied → Interview → Offer/Rejected
- 🎨 **Modern UI** - Beautiful glassmorphism design with Tailwind CSS
- 📱 **Responsive** - Works seamlessly on desktop and mobile devices
- 🔒 **Protected Routes** - Secure pages that require authentication

## 🚀 Quick Start

### Prerequisites

- Python 3.13+
- Node.js 18+
- MySQL database
- Virtual environment (recommended)

### Backend Setup

1. **Activate virtual environment:**
   ```bash
   .\venv\Scripts\Activate.ps1  # Windows PowerShell
   # or
   source venv/bin/activate     # Linux/Mac
   ```

2. **Install dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Configure database:**
   - Update database credentials in `backend/app/database.py`
   - Ensure MySQL database `smart_job_tracker` exists

4. **Run the server:**
   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8001
   ```

   The API will be available at `http://localhost:8001`
   - API Docs: `http://localhost:8001/docs`
   - ReDoc: `http://localhost:8001/redoc`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
Smart-Job-Tracker/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── models/       # Database models
│   │   ├── routers/      # API routes
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── utils/        # Utilities
│   │   └── main.py       # FastAPI app
│   └── requirements.txt
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── ...
│   └── package.json
└── venv/                 # Python virtual environment
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Vite** - Fast build tool

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **PyMySQL** - MySQL database connector
- **Python-JOSE** - JWT implementation
- **Passlib & Bcrypt** - Password hashing
- **Uvicorn** - ASGI server

## 📡 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Jobs
- `GET /jobs` - Get user's jobs (paginated)
- `POST /jobs` - Create new job
- `PUT /jobs/{id}` - Update job
- `PATCH /jobs/{id}/status` - Update job status
- `DELETE /jobs/{id}` - Delete job

### Health
- `GET /health` - Health check
- `GET /db-test` - Database connection test

## 🎨 UI Features

- **Glassmorphism Design** - Modern frosted glass effect
- **Gradient Backgrounds** - Beautiful color transitions
- **Status Badges** - Color-coded job status indicators
- **Statistics Cards** - Quick overview of your applications
- **Responsive Layout** - Works on all screen sizes
- **Loading States** - Smooth user experience
- **Error Handling** - User-friendly error messages

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Secure token storage

## 📝 Usage

1. **Register/Login** - Create an account or sign in
2. **Add Jobs** - Click "Add Job" to track a new application
3. **Track Status** - Update job status as you progress
4. **View Dashboard** - See statistics and all your applications
5. **Manage Jobs** - Update or delete jobs as needed

## 📚 Documentation

For detailed information about all changes and improvements, see [CHANGELOG.md](./CHANGELOG.md)

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

## 📄 License

This project is for personal/educational use.

---

**Built with ❤️ using React and FastAPI**
