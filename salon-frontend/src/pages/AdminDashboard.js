import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import ChatWidget from "../components/ChatWidget";

const categoryMeta = [
  { id: "haircut", title: "Hair Cut" },
  { id: "haircolor", title: "Hair Color" },
  { id: "manicure", title: "Manicure & Pedicure" },
  { id: "nails", title: "Nails" },
  { id: "facial", title: "Facial" },
  { id: "threading", title: "Threading & Waxing" },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [role, setRole] = useState("");

  // ---- Messages state ----
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  // ---- Services management state ----
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    service_name: "",
    detail: "",
    price: "",
    duration: "",
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!isLoggedIn) {
      navigate("/admin");
      return;
    }
    setRole(localStorage.getItem("userRole") || "");
    fetchBookings();
    fetchServices();
    fetchMessages();
  }, [navigate]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/bookings");
      if (!response.ok) throw new Error("Failed to fetch bookings");
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setErrorMsg("Could not load bookings. Please refresh.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      const response = await fetch("http://localhost:8000/messages");
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch("http://localhost:8000/services");
      const data = await response.json();
      setServices(data);
    } catch (err) {
      console.error("Failed to fetch services", err);
    }
  };

  const handleConfirm = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/bookings/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Confirmed" }),
      });
      if (!response.ok) throw new Error("Failed to update status");

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "Confirmed" } : b))
      );
    } catch (err) {
      alert("Could not confirm booking. Please try again.");
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("userRole");
    navigate("/admin");
  };

  // ---- Services management handlers ----
  const handleServiceFormChange = (e) => {
    setServiceForm({ ...serviceForm, [e.target.name]: e.target.value });
  };

  const resetServiceForm = () => {
    setServiceForm({ service_name: "", detail: "", price: "", duration: "" });
    setEditingId(null);
  };

  const handleAddOrUpdateService = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      alert("Please select a category first.");
      return;
    }

    const payload = {
      category: selectedCategory,
      service_name: serviceForm.service_name,
      detail: serviceForm.detail,
      price: serviceForm.price,
      duration: serviceForm.duration,
    };

    try {
      let response;
      if (editingId) {
        response = await fetch(`http://localhost:8000/services/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch("http://localhost:8000/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) throw new Error("Failed to save service");

      resetServiceForm();
      fetchServices();
    } catch (err) {
      alert("Could not save service. Please try again.");
      console.error(err);
    }
  };

  const handleEditClick = (service) => {
    setEditingId(service.id);
    setServiceForm({
      service_name: service.service_name,
      detail: service.detail || "",
      price: service.price,
      duration: service.duration,
    });
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      const response = await fetch(`http://localhost:8000/services/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete service");
      fetchServices();
    } catch (err) {
      alert("Could not delete service. Please try again.");
      console.error(err);
    }
  };

  const categoryServices = services.filter((s) => s.category === selectedCategory);

  return (
    <div className="admin-dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="admin-tag">— ADMIN DASHBOARD</p>
          <h2 className="admin-heading">All Bookings</h2>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </div>

      {loading && <p className="loading-text">Loading bookings...</p>}
      {errorMsg && <p className="form-error">{errorMsg}</p>}

      {!loading && bookings.length === 0 && (
        <p className="empty-text">No bookings yet.</p>
      )}

      {!loading && bookings.length > 0 && (
        <div className="bookings-table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.customer_name}</td>
                  <td>{b.phone}</td>
                  <td>{b.email}</td>
                  <td>{b.service}</td>
                  <td>{b.booking_date}</td>
                  <td>{b.booking_time}</td>
                  <td>
                    <span className={`status-badge status-${b.status.toLowerCase()}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {b.status === "Pending" ? (
                      <button
                        className="confirm-btn"
                        onClick={() => handleConfirm(b.id)}
                      >
                        Confirm
                      </button>
                    ) : (
                      <span className="done-text">✓ Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---- Messages section — visible to both admin and worker ---- */}
      <div className="messages-section" style={{ marginTop: "3rem" }}>
        <div className="dashboard-header">
          <div>
            <p className="admin-tag">— CUSTOMER INQUIRIES</p>
            <h2 className="admin-heading">Customer Messages</h2>
          </div>
        </div>

        {messagesLoading && <p className="loading-text">Loading messages...</p>}

        {!messagesLoading && messages.length === 0 && (
          <p className="empty-text">No messages yet.</p>
        )}

        {!messagesLoading && messages.length > 0 && (
          <div className="bookings-table-wrapper">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td>{m.phone}</td>
                    <td>{m.email}</td>
                    <td>{m.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ---- Manage Services section — admin only ---- */}
      {role === "admin" && (
        <div className="manage-services-section" style={{ marginTop: "3rem" }}>
          <div className="dashboard-header">
            <div>
              <p className="admin-tag">— SERVICE CATALOG</p>
              <h2 className="admin-heading">Manage Services</h2>
            </div>
          </div>

          <label className="form-label">SELECT CATEGORY</label>
          <select
            className="form-input"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              resetServiceForm();
            }}
          >
            <option value="">-- Choose a category --</option>
            {categoryMeta.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.title}</option>
            ))}
          </select>

          {selectedCategory && (
            <>
              <div className="services-manage-list" style={{ marginTop: "1.5rem" }}>
                {categoryServices.length === 0 && <p>No services in this category yet.</p>}
                {categoryServices.map((s) => (
                  <div key={s.id} className="service-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #eee" }}>
                    <div>
                      <p style={{ fontWeight: "bold", margin: 0 }}>{s.service_name}</p>
                      <p style={{ margin: 0, fontSize: "0.9em", color: "#777" }}>{s.detail}</p>
                      <p style={{ margin: 0, fontSize: "0.9em" }}>{s.duration} — {s.price}</p>
                    </div>
                    <div>
                      <button onClick={() => handleEditClick(s)} style={{ marginRight: "8px" }}>Edit</button>
                      <button onClick={() => handleDeleteService(s.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddOrUpdateService} style={{ marginTop: "1.5rem" }}>
                <h3>{editingId ? "Edit Service" : "Add New Service"}</h3>

                <label className="form-label">SERVICE NAME</label>
                <input
                  type="text"
                  name="service_name"
                  value={serviceForm.service_name}
                  onChange={handleServiceFormChange}
                  className="form-input"
                  required
                />

                <label className="form-label">DETAIL</label>
                <input
                  type="text"
                  name="detail"
                  value={serviceForm.detail}
                  onChange={handleServiceFormChange}
                  className="form-input"
                />

                <label className="form-label">PRICE</label>
                <input
                  type="text"
                  name="price"
                  placeholder="Rs. 1500"
                  value={serviceForm.price}
                  onChange={handleServiceFormChange}
                  className="form-input"
                  required
                />

                <label className="form-label">DURATION</label>
                <input
                  type="text"
                  name="duration"
                  placeholder="45 mins"
                  value={serviceForm.duration}
                  onChange={handleServiceFormChange}
                  className="form-input"
                  required
                />

                <button type="submit" className="admin-login-btn" style={{ marginTop: "1rem" }}>
                  {editingId ? "Update Service" : "Add Service"}
                </button>
                {editingId && (
                  <button type="button" onClick={resetServiceForm} style={{ marginLeft: "10px" }}>
                    Cancel
                  </button>
                )}
              </form>
            </>
          )}
        </div>
      )}
      {role === "admin" && (
        <ChatWidget
          apiUrl="http://localhost:8000/admin-chatbot"
          botName="Admin Assistant"
          greetingMessage="Hi! I'm your admin assistant. I can help you add, update, or manage salon services. What would you like to do?"
          bubbleGreeting="Need help managing services? 👋"
        />
      )}
    </div>
  );
}

export default AdminDashboard;