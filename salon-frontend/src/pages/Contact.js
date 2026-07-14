import { useState } from "react";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setSuccessMsg("Thanks! We'll get back to you within a day.");
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      setErrorMsg("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <p className="contact-tag">— GET IN TOUCH</p>
        <h2 className="contact-heading">We'd love to hear from you</h2>
        <p className="contact-subtext">
          Questions, bookings, or just want to say hi — reach out and our team
          will get back to you within a day.
        </p>
      </section>

      <section className="contact-main">
        <div className="contact-form-card">
          <h3 className="form-heading">Send us a message</h3>

          <form onSubmit={handleSubmit}>
            <label className="form-label">NAME</label>
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />

            <label className="form-label">PHONE</label>
            <input
              type="tel"
              name="phone"
              placeholder="03xx xxxxxxx"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
              required
            />

            <label className="form-label">EMAIL</label>
            <input
              type="email"
              name="email"
              placeholder="you@email.com"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />

            <label className="form-label">MESSAGE</label>
            <textarea
              name="message"
              placeholder="Tell us what you're looking for"
              value={formData.message}
              onChange={handleChange}
              className="form-textarea"
              rows="4"
              required
            ></textarea>

            {errorMsg && <p className="form-error">{errorMsg}</p>}
            {successMsg && <p className="form-success">{successMsg}</p>}

            <button type="submit" className="send-btn" disabled={submitting}>
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        <div className="contact-info-card">
          <h3 className="info-heading">Contact Info</h3>

          <div className="info-row">
            <div className="info-icon">📍</div>
            <div>
              <p className="info-label">ADDRESS</p>
              <p className="info-value">12 Willow Lane, Hyderabad, Sindh</p>
            </div>
          </div>

          <div className="info-row">
            <div className="info-icon">📞</div>
            <div>
              <p className="info-label">PHONE</p>
              <p className="info-value">+92 300 1234567</p>
            </div>
          </div>

          <div className="info-row">
            <div className="info-icon">✉️</div>
            <div>
              <p className="info-label">EMAIL</p>
              <p className="info-value">hello@bloomandbrush.com</p>
            </div>
          </div>

          <div className="hours-divider"></div>

          <div className="hours-row">
            <span>Tue – Fri</span>
            <span className="hours-time">10am – 8pm</span>
          </div>
          <div className="hours-row">
            <span>Saturday</span>
            <span className="hours-time">9am – 8pm</span>
          </div>
          <div className="hours-row">
            <span>Sunday</span>
            <span className="hours-time">11am – 6pm</span>
          </div>
          <div className="hours-row">
            <span>Monday</span>
            <span className="hours-time">Closed</span>
          </div>
        </div>
      </section>

      <section className="map-section">
        <div className="map-placeholder">
          <span className="map-label">📍 Map goes here</span>
        </div>
      </section>

      <section className="call-strip">
        <p>📞 <strong>Prefer to call? Ring us directly.</strong></p>
      </section>
    </div>
  );
}

export default Contact;