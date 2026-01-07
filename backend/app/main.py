from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from sqlalchemy import text
from app.routers import user, auth, job, ai



app = FastAPI(
    title="Smart Job Application Tracker",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables later (for now this does nothing)
Base.metadata.create_all(bind=engine)

# Register routers
app.include_router(user.router, prefix="/api/users")
app.include_router(auth.router, prefix="/api/auth")
app.include_router(job.router, prefix="/api/jobs")
app.include_router(ai.router, prefix="/api/ai")

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/db-test")
def db_test():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {"db_status": "connected"}
