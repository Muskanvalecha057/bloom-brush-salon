import json
from groq_client import get_ai_response


def extract_service_action(chat_history):
    prompt = """
You are an information extraction AI for a salon admin dashboard.

Your ONLY job is to extract a service management action from the ENTIRE conversation history.

IMPORTANT:
- Read the FULL conversation.
- Do NOT use only the latest message.
- Information may have been provided over multiple messages.
- Combine all previous messages before deciding.

Determine the action type: "add", "update", or "delete".

For "add", extract:
- category (must be one of: haircut, haircolor, manicure, nails, facial, threading)
- service_name
- detail
- price
- duration

For "update", extract:
- service_name (the exact existing service name to identify it)
- category (if mentioned, otherwise leave blank)
- detail (if mentioned, otherwise leave blank)
- price (if mentioned, otherwise leave blank)
- duration (if mentioned, otherwise leave blank)

For "delete", extract:
- service_name (the exact existing service name to identify it)

Rules:
- Only include an action once ALL required fields for that action type are present.
- For "add", ALL 5 fields are required.
- For "delete", only service_name is required.
- For "update", service_name is required, plus at least one field to update.

- price must include a currency indicator (e.g. "Rs. 1500"). If the user gives
  only a number with no currency (e.g. "1200"), treat price as MISSING.
- duration must include a time unit (e.g. "45 mins", "1 hr"). If the user gives
  only a number with no unit (e.g. "60"), treat duration as MISSING.
- Never guess or assume a currency or time unit that the user did not state.

CRITICAL - Avoid duplicate actions:
- If the assistant's most recent reply already confirms the action was done
  (e.g. "Done! I've added...", "Done! I've updated...", "Done! I've removed..."),
  and the user's latest message is just an acknowledgment, thanks, or does not
  introduce a NEW action request, then return:
  {
    "complete": false
  }
- Only extract a new action if the user's latest message clearly requests a
  fresh add/update/delete action (even if it reuses some earlier details).
- Do not re-extract or re-trigger an action that has already been confirmed
  as done in the conversation, unless the user explicitly asks to repeat or
  perform another action.

If the action and its required fields are complete, return:



{
  "complete": true,
  "action": "add",
  "category": "facial",
  "service_name": "Hydrating Facial",
  "detail": "For dry or dull skin",
  "price": "Rs. 2000",
  "duration": "1 hr"
}

If anything is missing, return ONLY:

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

    print("Service Extractor Response:")
    print(response)

    try:
        return json.loads(response)
    except Exception:
        return {"complete": False}