from models import Booking


def save_booking(db, booking_data):
    services_list = booking_data["services"]

    # Convert list of services into a comma-separated string for storage
    services_string = ", ".join(services_list)

    new_booking = Booking(
        customer_name=booking_data["customer_name"],
        email=booking_data["email"],
        phone=booking_data["phone"],
        service=services_string,
        booking_date=booking_data["booking_date"],
        booking_time=booking_data["booking_time"],
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    return new_booking