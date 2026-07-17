import React, { useState, useRef, useEffect } from "react";
import "./ChatWidget.css";
import mascot from "../assets/Ai_bot.png";

function ChatWidget({
  apiUrl = "http://localhost:8000/chatbot",
  greetingMessage = "Hi there! I'm BeautyBrain, your Bloom & Brush assistant. How can I help you today?",
  botName = "Beauty&Brain Bot",
  bubbleGreeting = "Hi! How can I assist you today? 👋"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: greetingMessage,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const updatedMessages = [...messages, { role: "user", content: text }];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Sorry, I couldn't connect right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => sendMessage(input);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <img src={mascot} alt={botName} className="header-mascot" />
            <div>
              <div className="title">{botName}</div>
              <div className="status">Online now</div>
            </div>
            <div className="close-btn" onClick={() => setIsOpen(false)}>
              &times;
            </div>
          </div>

          <div className="chat-body" ref={bodyRef}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={msg.role === "user" ? "bubble-user" : "bubble-bot"}
              >
                {msg.content}
              </div>
            ))}
            {loading && <div className="bubble-bot typing">Typing...</div>}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="send-btn" onClick={handleSend}>
              <svg viewBox="0 0 24 24">
                <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {!isOpen && showGreeting && (
        <div className="greeting-bubble">
          <span
            className="greeting-close"
            onClick={(e) => {
              e.stopPropagation();
              setShowGreeting(false);
            }}
          >
            &times;
          </span>
          {bubbleGreeting}
        </div>
      )}

      <div
        className="chat-fab-wrap"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className="fab-ring"></div>
        <div className="fab-ring ring2"></div>
        <div className="fab-ring ring3"></div>
        <div className="fab-glow"></div>
        <div className="chat-fab">
          <img src={mascot} alt={botName} className="fab-mascot" />
        </div>
      </div>
    </>
  );
}

export default ChatWidget;