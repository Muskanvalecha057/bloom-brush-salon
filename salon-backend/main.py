from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import date, time, datetime
from passlib.context import CryptContext
from email_utils import send_confirmation_email
from chatbot_logic import get_chatbot_reply
from booking_service import save_booking
from booking_extractor import extract_booking_data
from booking_validator import validate_booking_datetime
from admin_chatbot_logic import get_admin_chatbot_reply
from service_extractor import extract_service_action

from database import Base, engine, SessionLocal
from models import Booking, Admin, Worker, Service, Message

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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

@app.get("/")
def read_root():
    return {"message": "salon backend is working!"}

@app.post("/bookings")
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    new_booking = save_booking(db, booking.model_dump())
    return {
        "message": "Booking created successfully",
        "booking_id": new_booking.id,
    }

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
    admin = db.query(Admin).filter(Admin.email == credentials.email).first()
    if admin and credentials.password == admin.password:
        return {"role": "admin", "email": admin.email}

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
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]

@app.post("/chatbot")
def chatbot(request: ChatRequest, db: Session = Depends(get_db)):
    services = db.query(Service).all()

    chat_history = [
        {"role": m.role, "content": m.content}
        for m in request.messages
    ]

    booking_keywords = [
        "book", "booking", "appointment", "krwani", "karwani",
        "krna hai", "karna hai", "reserve", "schedule"
    ]

    has_booking_intent = any(
        keyword in m["content"].lower()
        for m in chat_history
        if m["role"] == "user"
        for keyword in booking_keywords
    )

    reply = get_chatbot_reply(chat_history, services)

    if has_booking_intent:
        booking_data = extract_booking_data(chat_history)
    else:
        booking_data = {"complete": False}

    print("Booking Data:")
    print(booking_data)

    if booking_data.get("complete"):

        try:
            booking_date = datetime.strptime(
                booking_data["booking_date"],
                "%Y-%m-%d"
            ).date()

            booking_time = datetime.strptime(
                booking_data["booking_time"],
                "%H:%M:%S"
            ).time()

        except Exception:
            return {
                "reply": "Sorry, I couldn't understand the booking date or time. Please enter them again."
            }

        is_valid, message = validate_booking_datetime(
            booking_date,
            booking_time
        )

        if not is_valid:
            return {
                "reply": message
            }

        services_string = ", ".join(booking_data["services"])

        duplicate = db.query(Booking).filter(
            Booking.email == booking_data["email"],
            Booking.phone == booking_data["phone"],
            Booking.service == services_string,
            Booking.booking_date == booking_date,
            Booking.booking_time == booking_time
        ).first()

        if duplicate:
            return {
                "reply": "Thank you! Your booking request has been received and is currently pending. We'll confirm it shortly and send you an email once it's approved."
            }

        new_booking = save_booking(db, {
            "customer_name": booking_data["customer_name"],
            "email": booking_data["email"],
            "phone": booking_data["phone"],
            "services": booking_data["services"],
            "booking_date": booking_date,
            "booking_time": booking_time
        })

        return {
            "reply": "Thank you! Your booking request has been received and is currently pending. We'll confirm it shortly and send you an email once it's approved."
        }

    return {
        "reply": reply
    }

class AdminChatMessage(BaseModel):
    role: str
    content: str

class AdminChatRequest(BaseModel):
    messages: list[AdminChatMessage]

@app.post("/admin-chatbot")
def admin_chatbot(request: AdminChatRequest, db: Session = Depends(get_db)):
    services = db.query(Service).all()

    chat_history = [
        {"role": m.role, "content": m.content}
        for m in request.messages
    ]

    action_keywords = ["add", "update", "delete", "remove", "change", "new service", "price"]

    has_action_intent = any(
        keyword in m["content"].lower()
        for m in chat_history
        if m["role"] == "user"
        for keyword in action_keywords
    )

    reply = get_admin_chatbot_reply(chat_history, services)

    if has_action_intent:
        action_data = extract_service_action(chat_history)
    else:
        action_data = {"complete": False}

    print("Action Data:")
    print(action_data)

    if action_data.get("complete"):
        action = action_data.get("action")

        if action == "add":
            new_service = Service(
                category=action_data["category"],
                service_name=action_data["service_name"],
                detail=action_data.get("detail", ""),
                price=action_data["price"],
                duration=action_data["duration"],
            )
            db.add(new_service)
            db.commit()
            db.refresh(new_service)

            return {"reply": f"Done! I've added '{new_service.service_name}' to the {new_service.category} category."}

        elif action == "update":
            existing = db.query(Service).filter(
                Service.service_name.ilike(action_data["service_name"])
            ).first()

            if not existing:
                return {"reply": f"I couldn't find a service named '{action_data['service_name']}'. Could you double-check the name?"}

            if action_data.get("category"):
                existing.category = action_data["category"]
            if action_data.get("detail"):
                existing.detail = action_data["detail"]
            if action_data.get("price"):
                existing.price = action_data["price"]
            if action_data.get("duration"):
                existing.duration = action_data["duration"]

            db.commit()
            db.refresh(existing)

            return {"reply": f"Done! I've updated '{existing.service_name}'."}

        elif action == "delete":
            existing = db.query(Service).filter(
                Service.service_name.ilike(action_data["service_name"])
            ).first()

            if not existing:
                return {"reply": f"I couldn't find a service named '{action_data['service_name']}'. Could you double-check the name?"}

            db.delete(existing)
            db.commit()

            return {"reply": f"Done! I've removed '{action_data['service_name']}' from the catalog."}

    return {"reply": reply}