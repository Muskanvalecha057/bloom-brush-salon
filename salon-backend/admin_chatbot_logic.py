import os
from groq_client import get_ai_response

with open(os.path.join(os.path.dirname(__file__), "admin_system_prompt.txt"), "r", encoding="utf-8") as f:
    ADMIN_SYSTEM_PROMPT = f.read()

def build_services_context(services):
    """Convert DB service rows into a readable text block for the AI."""
    if not services:
        return "No services exist yet."
    lines = []
    for s in services:
        lines.append(f"- ID {s.id}: {s.service_name} ({s.category}): {s.price}, {s.duration}")
    return "\n".join(lines)

def get_admin_chatbot_reply(chat_history: list, services: list):
    services_context = build_services_context(services)
    system_message = {
        "role": "system",
        "content": f"{ADMIN_SYSTEM_PROMPT}\n\nHere is the current list of salon services:\n{services_context}"
    }
    messages = [system_message] + chat_history
    try:
        return get_ai_response(messages)
    except Exception as e:
        print(f"AI response error: {e}")
        return "Sorry, I'm having trouble connecting right now. Please try again in a few minutes."
