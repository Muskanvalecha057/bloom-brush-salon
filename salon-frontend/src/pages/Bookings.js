import { useState, useEffect } from "react";
import "./Bookings.css";

const categoryMeta = [
  { id: "haircut", title: "Hair Cut" },
  { id: "haircolor", title: "Hair Color" },
  { id: "manicure", title: "Manicure & Pedicure" },
  { id: "nails", title: "Nails" },
  { id: "facial", title: "Facial" },
  { id: "threading", title: "Threading & Waxing" },
];

function Booking() {
  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    phone: "",
    booking_date: "",
    booking_time: "",
  });

  const [allServices, setAllServices] = useState([]);
  const [openCategories, setOpenCategories] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("http://localhost:8000/services");
      const data = await response.json();
      setAllServices(data);
    } catch (err) {
      console.error("Failed to fetch services", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleCategory = (id) => {
    setOpenCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleService = (serviceName) => {
    setSelectedServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((s) => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (selectedServices.length === 0) {
      setErrorMsg("Please select at least one service.");
      return;
    }

    const payload = {
      customer_name: formData.customer_name,
      email: formData.email,
      phone: formData.phone,
      service: selectedServices.join(", "),
      booking_date: formData.booking_date,
      booking_time: formData.booking_time,
    };

    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:8000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit booking");
      }

      setSuccessMsg("Booking submitted successfully! We'll confirm shortly.");
      setFormData({
        customer_name: "",
        email: "",
        phone: "",
        booking_date: "",
        booking_time: "",
      });
      setSelectedServices([]);
      setOpenCategories([]);
    } catch (err) {
      setErrorMsg("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-page">
      <section className="booking-hero">
        <p className="booking-tag">— BOOK YOUR VISIT</p>
        <h2 className="booking-heading">Reserve your appointment</h2>
        <p className="booking-subtext">
          Pick your services, choose a time that works for you, and we'll take care of the rest.
        </p>
      </section>

      <section className="booking-form-section">
        <form className="booking-form-card" onSubmit={handleSubmit}>
          <label className="form-label">FULL NAME</label>
          <input
            type="text"
            name="customer_name"
            placeholder="Your full name"
            value={formData.customer_name}
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

          <label className="form-label">PHONE NUMBER</label>
          <input
            type="tel"
            name="phone"
            placeholder="03XX-XXXXXXX"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
            required
          />

          <label className="form-label">SELECT SERVICES</label>
          <div className="category-accordion">
            {categoryMeta.map((cat) => {
              const isOpen = openCategories.includes(cat.id);
              const catServices = allServices.filter((s) => s.category === cat.id);
              const selectedCount = catServices.filter((s) =>
                selectedServices.includes(s.service_name)
              ).length;

              return (
                <div key={cat.id} className="category-block">
                  <div
                    className={`category-header-row ${isOpen ? "open" : ""}`}
                    onClick={() => toggleCategory(cat.id)}
                  >
                    <span className="category-title-text">{cat.title}</span>
                    {selectedCount > 0 && (
                      <span className="selected-count-badge">{selectedCount} selected</span>
                    )}
                    <span className="accordion-arrow">{isOpen ? "▲" : "▼"}</span>
                  </div>

                  {isOpen && (
                    <div className="sub-services-list">
                      {catServices.map((s) => (
                        <label key={s.id} className="sub-service-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(s.service_name)}
                            onChange={() => toggleService(s.service_name)}
                          />
                          <span>{s.service_name} — {s.duration}, {s.price}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="date-time-row">
            <div className="date-time-col">
              <label className="form-label">DATE</label>
              <input
                type="date"
                name="booking_date"
                value={formData.booking_date}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="date-time-col">
              <label className="form-label">TIME</label>
              <input
                type="time"
                name="booking_time"
                value={formData.booking_time}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          {errorMsg && <p className="form-error">{errorMsg}</p>}
          {successMsg && <p className="form-success">{successMsg}</p>}

          <button type="submit" className="booking-submit-btn" disabled={submitting}>
            {submitting ? "Submitting..." : "Confirm Booking"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default Booking;