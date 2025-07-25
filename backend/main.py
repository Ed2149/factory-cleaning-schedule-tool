from fastapi import FastAPI, Depends, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, User, Task
from auth import hash_password, verify_password
from pydantic import BaseModel
from sqlalchemy import desc
import traceback

Base.metadata.create_all(bind=engine)

app = FastAPI()

# ✅ Enable CORS for GitHub Pages frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ed2149.github.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/signup")
def signup(name: str = Form(...), email: str = Form(...), password: str = Form(...), role: str = Form(...), db: Session = Depends(get_db)):
    try:
        if db.query(User).filter(User.email == email).first():
            return JSONResponse(status_code=400, content={"detail": "Email already registered"})

        user = User(name=name, email=email, password=hash_password(password), role=role)
        db.add(user)
        db.commit()
        return {"message": "Account created"}
    except Exception:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"detail": "Signup failed due to server error"})

@app.post("/login")
def login(email: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password):
            return JSONResponse(status_code=401, content={"detail": "Invalid email or password"})

        # ✅ Centralized role-based redirect
        role_redirects = {
            "manager": "/manager_dashboard.html",
            "staff": "/staff_dashboard.html"
        }
        redirect_url = role_redirects.get(user.role, "/index.html")  # fallback to homepage if role is unrecognized
        print(f"Login attempt: {email}")
        print(f"Redirecting to: {redirect_url}")     
        return JSONResponse(status_code=200, content={"redirect": redirect_url})
    except Exception:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"detail": "Login failed due to server error"})


@app.get("/")
def home():
    return {"message": "API is live 🎉"}

class TaskCreate(BaseModel):
    title: str
    description: str
    assigned_to: str
    status: str

@app.post("/tasks")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    try:
        new_task = Task(**task.dict())
        db.add(new_task)
        db.commit()
        return {"message": "Task created"}
    except Exception:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"detail": "Task creation failed"})

@app.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).order_by(desc(Task.id)).all()

@app.patch("/tasks/{task_id}")
def update_task_status(task_id: int, status: str = Form(...), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return JSONResponse(status_code=404, content={"detail": "Task not found"})
    task.status = status
    db.commit()
    return {"message": "Task status updated"}
