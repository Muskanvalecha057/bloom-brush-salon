import os
from groq_client import get_ai_response

# Load system prompt once when the server starts
with open(os.path.join(os.path.dirname(__file__), "system_prompt.txt"), "r", encoding="utf-8") as f:
    SYSTEM_PROMPT = f.read()

def build_context(services):
    """Convert DB service rows into a readable text block for the AI."""
    if not services:
        return "No services available right now."
    lines = []
    for s in services:
        lines.append(f"- {s.service_name} ({s.category}): {s.detail}, Price: {s.price}, Duration: {s.duration}")
    return "\n".join(lines)

def get_chatbot_reply(chat_history: list, services: list):
    """
    chat_history: list of {"role": "user"/"assistant", "content": "..."} 
    representing the full conversation so far, including the latest user message.
    """
    services_context = build_context(services)

    # System prompt + current services data, sent fresh every time
    system_message = {
        "role": "system",
        "content": f"{SYSTEM_PROMPT}\n\nHere is the current list of salon services:\n{services_context}"
    }

    # Final messages list: system + full conversation history
    messages = [system_message] + chat_history

    return get_ai_response(messages)