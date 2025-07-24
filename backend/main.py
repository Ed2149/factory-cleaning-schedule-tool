from fastapi import FastAPI, Depends, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, User
from auth import hash_password, verify_password
import traceback

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to your frontend domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Dependency injection: database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 👤 SIGNUP ROUTE
@app.post("/signup")
def signup(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    role: str = Form(...),
    db: Session = Depends(get_db)
):
    try:
        if db.query(User).filter(User.email == email).first():
            raise HTTPException(status_code=400, detail="Email already registered")

        user = User(
            name=name,
            email=email,
            password=hash_password(password),
            role=role
        )
        db.add(user)
        db.commit()
        return {"message": "Account created"}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Something went wrong during signup")

# 🔐 LOGIN ROUTE
@app.post("/login")
def login(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    try:
        user = db.query(User).filter(User.email == email).first()

        if not user or not verify_password(password, user.password):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        # Redirect logic based on user role
        if user.role == "manager":
            return {"redirect": "/manager_dashboard.html"}
        elif user.role == "staff":
            return {"redirect": "/employee_dashboard.html"}
        
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Login failed due to server error")

from sqlalchemy import desc
from pydantic import BaseModel

# Task model (you should also define Task in models.py, see below)
class TaskCreate(BaseModel):
    title: str
    description: str
    assigned_to: str  # staff email or name
    status: str  # e.g. "pending", "done"

@app.post("/tasks")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    new_task = Task(**task.dict())
    db.add(new_task)
    db.commit()
    return {"message": "Task created"}

@app.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(Task).order_by(desc(Task.id)).all()
    return tasks

@app.patch("/tasks/{task_id}")
def update_task_status(task_id: int, status: str = Form(...), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.status = status
    db.commit()
    return {"message": "Task status updated"}
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://deluxe-rabanadas-fa1ebc.netlify.app"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
