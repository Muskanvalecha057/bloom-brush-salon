import logo from "../assets/logo.png";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
    { name: "Admin", path: "/admin" },
  ];

  return (
    <div className="navbar-wrapper">
      <div className="navbar-logo">
        <img src={logo} alt="Bloom & Brush Logo" className="logo-img" />

        <div>
          <span className="logo-main">Bloom</span>
          <span className="logo-sub">& Brush</span>
        </div>
      </div>

      <div className="nav-and-book-group">
        <nav className="navbar-pill">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <Link to="/booking" className="book-now-navbar-btn">
          Book Now
        </Link>
      </div>
    </div>
  );
}

export default Navbar;