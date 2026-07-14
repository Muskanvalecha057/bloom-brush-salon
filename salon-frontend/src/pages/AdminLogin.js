import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();

      // Login successful — save role and redirect
      localStorage.setItem("isAdminLoggedIn", "true");
      localStorage.setItem("userRole", data.role);
      navigate("/admin/dashboard");
    } catch (err) {
      setErrorMsg("Invalid email or password. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <p className="admin-tag">— ADMIN ACCESS</p>
        <h2 className="admin-heading">Welcome back</h2>
        <p className="admin-subtext">Log in to manage bookings</p>

        <form onSubmit={handleSubmit}>
          <label className="form-label">EMAIL</label>
          <input
            type="email"
            name="email"
            placeholder="admin@bloomandbrush.com"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
          />

          <label className="form-label">PASSWORD</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            required
          />

          {errorMsg && <p className="form-error">{errorMsg}</p>}

          <button type="submit" className="admin-login-btn" disabled={submitting}>
            {submitting ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;