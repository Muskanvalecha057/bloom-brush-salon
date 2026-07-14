import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_APP_PASSWORD = os.getenv("EMAIL_APP_PASSWORD")


def send_confirmation_email(to_email: str, customer_name: str, service: str, booking_date, booking_time):
    subject = "Your Appointment is Confirmed - Bloom & Brush"

    body = f"""Hi {customer_name},

Your appointment is confirmed! Here are the details:

Service: {service}
Date: {booking_date}
Time: {booking_time}

Please be on time. We look forward to seeing you.

Thank you,
Bloom & Brush Team
"""

    msg = MIMEMultipart()
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_APP_PASSWORD)
            server.sendmail(EMAIL_ADDRESS, to_email, msg.as_string())
        print(f"Confirmation email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")