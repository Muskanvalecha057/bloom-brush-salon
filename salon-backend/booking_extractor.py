import json
from groq_client import get_ai_response


def extract_booking_data(chat_history):
    prompt = """
You are an information extraction AI.

Your ONLY job is to extract booking information from the ENTIRE conversation history.

IMPORTANT:
- Read the FULL conversation.
- Do NOT use only the latest message.
- Information may have been provided over multiple messages.
- Combine all previous messages before deciding.
- A customer may request MORE THAN ONE service in a single booking. Collect ALL requested services into a list.

Extract these fields:

- customer_name
- phone
- email
- services (a list of one or more service names)
- booking_date
- booking_time

Rules:

- booking_date must be YYYY-MM-DD
- booking_time must be HH:MM:SS (24-hour format)
- services must always be a JSON list, even if there is only one service.

Examples:

User:
Book Hydrating Facial.

User:
20 July 2026 at 3 PM

User:
Muskan

User:
03312345678 abc@gmail.com

Return:

{
  "complete": true,
  "customer_name": "Muskan",
  "phone": "03312345678",
  "email": "abc@gmail.com",
  "services": ["Hydrating Facial"],
  "booking_date": "2026-07-20",
  "booking_time": "15:00:00"
}

Example with multiple services:

User:
Classic Manicure and Spa Pedicure both

Return (once all other fields are also collected):

{
  "complete": true,
  "customer_name": "Muskan",
  "phone": "03312345678",
  "email": "abc@gmail.com",
  "services": ["Classic Manicure", "Spa Pedicure"],
  "booking_date": "2026-07-20",
  "booking_time": "15:00:00"
}

If ANY field is missing return ONLY:

{
  "complete": false
}

Return ONLY valid JSON.
No markdown.
No explanation.
"""

    messages = [
        {"role": "system", "content": prompt},
        *chat_history
    ]

    response = get_ai_response(messages)

    print("Extractor Response:")
    print(response)

    try:
        return json.loads(response)
    except Exception:
        return {"complete": False}