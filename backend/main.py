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
