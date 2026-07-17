from datetime import datetime, date


def validate_booking_datetime(booking_date, booking_time):

    # Convert string → date/time
    if isinstance(booking_date, str):
        booking_date = datetime.strptime(booking_date, "%Y-%m-%d").date()

    if isinstance(booking_time, str):
        booking_time = datetime.strptime(booking_time, "%H:%M:%S").time()

    if booking_date < date.today():
        return False, "Please choose a future date for your appointment."
    weekday = booking_date.strftime("%A")

    if weekday == "Monday":
        return False, "Sorry, our salon is closed on Mondays."

    booking_minutes = booking_time.hour * 60 + booking_time.minute

    if weekday in ["Tuesday", "Wednesday", "Thursday", "Friday"]:
        open_time = 10 * 60
        close_time = 20 * 60

    elif weekday == "Saturday":
        open_time = 9 * 60
        close_time = 20 * 60

    elif weekday == "Sunday":
        open_time = 11 * 60
        close_time = 18 * 60

    else:
        return False, "Invalid booking date."

    if booking_minutes < open_time or booking_minutes >= close_time:
        return False, "Please choose a time within our studio hours."

    return True, ""