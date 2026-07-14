from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import date, time
from passlib.context import CryptContext
from email_utils import send_confirmation_email
from chatbot_logic import get_chatbot_reply

from database import Base, engine, SessionLocal
from models import Booking, Admin, Worker, Service, Message

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS setup — allows React (localhost:3000) to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------- Schemas ----------

class BookingCreate(BaseModel):
    customer_name: str
    email: str
    phone: str
    service: str
    booking_date: date
    booking_time: time

class LoginRequest(BaseModel):
    email: str
    password: str

# ---------- Routes ----------

@app.get("/")
def read_root():
    return {"message": "salon backend is working!"}

@app.post("/bookings")
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    new_booking = Booking(
        customer_name=booking.customer_name,
        email=booking.email,
        phone=booking.phone,
        service=booking.service,
        booking_date=booking.booking_date,
        booking_time=booking.booking_time,
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return {"message": "Booking created successfully", "booking_id": new_booking.id}

@app.get("/bookings")
def get_bookings(db: Session = Depends(get_db)):
    bookings = db.query(Booking).all()
    return bookings

@app.put("/bookings/{booking_id}/status")
def update_booking_status(booking_id: int, status_update: dict, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking.status = status_update.get("status")
    db.commit()
    db.refresh(booking)

    # Send confirmation email only when status is set to "Confirmed"
    if booking.status == "Confirmed":
        send_confirmation_email(
            to_email=booking.email,
            customer_name=booking.customer_name,
            service=booking.service,
            booking_date=booking.booking_date,
            booking_time=booking.booking_time,
        )

    return {"message": "Status updated", "booking_id": booking.id, "status": booking.status}

@app.post("/login")
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    # Check admin table first
    admin = db.query(Admin).filter(Admin.email == credentials.email).first()
    if admin and credentials.password == admin.password:
        return {"role": "admin", "email": admin.email}

    # Check worker table
    worker = db.query(Worker).filter(Worker.email == credentials.email).first()
    if worker and credentials.password == worker.password:
        return {"role": "worker", "email": worker.email}

    raise HTTPException(status_code=401, detail="Wrong email or password")

class ServiceCreate(BaseModel):
    category: str
    service_name: str
    detail: str = ""
    price: str
    duration: str


@app.get("/services")
def get_services(db: Session = Depends(get_db)):
    return db.query(Service).all()


@app.post("/services")
def create_service(service: ServiceCreate, db: Session = Depends(get_db)):
    new_service = Service(**service.dict())
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return {"message": "Service added", "service_id": new_service.id}


@app.put("/services/{service_id}")
def update_service(service_id: int, service: ServiceCreate, db: Session = Depends(get_db)):
    existing = db.query(Service).filter(Service.id == service_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Service not found")
    for key, value in service.dict().items():
        setattr(existing, key, value)
    db.commit()
    return {"message": "Service updated"}


@app.delete("/services/{service_id}")
def delete_service(service_id: int, db: Session = Depends(get_db)):
    existing = db.query(Service).filter(Service.id == service_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(existing)
    db.commit()
    return {"message": "Service deleted"}

class MessageCreate(BaseModel):
    name: str
    phone: str
    email: str
    message: str


@app.post("/messages")
def create_message(msg: MessageCreate, db: Session = Depends(get_db)):
    new_msg = Message(
        name=msg.name,
        phone=msg.phone,
        email=msg.email,
        message=msg.message,
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    return {"message": "Message saved successfully", "id": new_msg.id}


@app.get("/messages")
def get_messages(db: Session = Depends(get_db)):
    return db.query(Message).all()

class ChatMessage(BaseModel):
    role: str      # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]

@app.post("/chatbot")
def chatbot(request: ChatRequest, db: Session = Depends(get_db)):
    services = db.query(Service).all()
    chat_history = [{"role": m.role, "content": m.content} for m in request.messages]
    reply = get_chatbot_reply(chat_history, services)
    return {"reply": reply}