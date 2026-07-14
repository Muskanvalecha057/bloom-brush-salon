import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,40 C360,100 1080,0 1440,50 L1440,0 L0,0 Z" fill="#ffffff"></path>
        </svg>
      </div>

      <div className="footer-badges">
        <div className="badge-item">
          <span className="badge-icon">🛡️</span>
          <p>Licensed & certified stylists</p>
        </div>
        <div className="badge-item">
          <span className="badge-icon">🕐</span>
          <p>5+ years serving Hyderabad</p>
        </div>
        <div className="badge-item">
          <span className="badge-icon">❤️</span>
          <p>4.8/5 average client rating</p>
        </div>
        <div className="badge-item">
          <span className="badge-icon">💳</span>
          <p>Secure online booking</p>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-content">
        <div className="footer-brand">
          <h3>Bloom & Brush</h3>
          <p className="footer-subtitle">HAIR & BEAUTY</p>
          <p className="footer-desc">
            A calm, considered space for hair, skin, nails and grooming —
            thoughtful service, honest advice, no pressure.
          </p>
          <div className="social-icons">
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="Pinterest">📌</a>
            <a href="#" aria-label="LinkedIn">💼</a>
          </div>
        </div>

        <div className="footer-links">
          <h4>EXPLORE</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/gallery">Gallery</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-hours">
          <h4>STUDIO HOURS</h4>
          <div className="hours-row"><span>Tue – Fri</span><span>10am – 8pm</span></div>
          <div className="hours-row"><span>Saturday</span><span>9am – 8pm</span></div>
          <div className="hours-row"><span>Sunday</span><span>11am – 6pm</span></div>
          <div className="hours-row"><span>Monday</span><span>Closed</span></div>
        </div>

        <div className="footer-contact">
  <h4>STAY IN TOUCH</h4>
  <p className="footer-contact-desc">
    Have a question or want to book? Reach out anytime.
  </p>
  <a href="/contact" className="footer-contact-link">Contact Us →</a>
  <div className="newsletter">
    <input type="email" placeholder="Subscribe for offers" />
    <button>Join</button>
  </div>
</div>
</div>
      

      <div className="footer-bottom">
        <p>&copy; 2026 Bloom & Brush. All rights reserved.</p>
        <div className="footer-policy-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/cancellation">Cancellation Policy</a>
        </div>
        <p className="footer-tagline">Designed for a calmer kind of beautiful.</p>
      </div>
    </footer>
  );
}

export default Footer;