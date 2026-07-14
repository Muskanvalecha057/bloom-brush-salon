from sqlalchemy import Column, Integer, String, Date, Time, DateTime
from sqlalchemy.sql import func
from database import Base

class Admin(Base):
    __tablename__ = "admin"

    id = Column(Integer, primary_key = True, index=True)
    email = Column(String(255), unique=True, nullable=True)
    password=Column(String(255), unique=True, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(255), nullable=False)
    service = Column(String(255), nullable=False)
    booking_date = Column(Date, nullable=False)
    booking_time = Column(Time, nullable=False)
    status = Column(String(20), default="Pending")
    created_at = Column(DateTime, server_default=func.now())

class Worker(Base):
    __tablename__ = "worker"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100), nullable=False)
    service_name = Column(String(255), nullable=False)
    detail = Column(String(255), nullable=True)
    price = Column(String(50), nullable=False)
    duration = Column(String(50), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(255), nullable=False)
    message = Column(String(1000), nullable=False)
    created_at = Column(DateTime, server_default=func.now())