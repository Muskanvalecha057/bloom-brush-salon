import { Link } from "react-router-dom";
import "./About.css";
import workingImg from "../assets/working.png";

function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <p className="about-tag">— OUR STORY</p>
        <h2 className="about-heading">The story behind Bloom &amp; Brush</h2>
        <p className="about-subtext">
          A quiet, considered space built around one simple idea — everyone
          deserves to feel taken care of, not rushed through an appointment.
        </p>
      </section>

      {/* Why We Started */}
      <section className="story-section">
        <div className="story-image-wrap">
          <img src={workingImg} alt="Stylist working at Bloom & Brush" className="story-img" />
        </div>
        <div className="story-text">
          <h3 className="story-heading">Why we started</h3>
          <p className="story-para">
            Bloom &amp; Brush began with a simple frustration — appointments that felt
            rushed, and stylists too busy to really listen. We wanted something
            different: a studio where you're heard before a single cut is made.
          </p>
          <p className="story-para">
            What started as a two-chair setup has grown into a full studio for hair,
            skin, and nails, but the idea hasn't changed. Every service still starts
            with a conversation, not a clock.
          </p>
          <p className="story-para">
            Today, our team carries that same care into every appointment —
            unhurried, honest, and entirely about you.
          </p>
        </div>
      </section>

      {/* Our Values */}
      <section className="values-section">
        <p className="values-tag">WHAT WE STAND FOR</p>
        <h2 className="values-heading">Our Values</h2>

        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🕐</div>
            <h4 className="value-title">No Rush, No Upsell</h4>
            <p className="value-desc">
              Your time and trust matter — we never push services you don't need.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">🛡️</div>
            <h4 className="value-title">Hygiene First</h4>
            <p className="value-desc">
              Sterilised tools and fresh supplies for every single appointment.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">❤️</div>
            <h4 className="value-title">Personalized Care</h4>
            <p className="value-desc">
              A quick consultation before every service, so the result is truly yours.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">✂️</div>
            <h4 className="value-title">Skilled Stylists</h4>
            <p className="value-desc">
              A team that trains continuously — technique first, trends second.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Team - Founders/Leads only */}
      <section className="team-section">
        <p className="team-tag">THE PEOPLE</p>
        <h2 className="team-heading">Meet the Team</h2>

        <div className="team-grid">
          <div className="team-card">
            <div className="team-avatar">👤</div>
            <h4 className="team-name">Ayesha Raza</h4>
            <p className="team-role">Founder &amp; Senior Stylist</p>
            <span className="team-badge">Hair Specialist</span>
          </div>

          <div className="team-card">
            <div className="team-avatar">👤</div>
            <h4 className="team-name">Fatima Bhatti</h4>
            <p className="team-role">Co-Founder</p>
            <span className="team-badge">Skin &amp; Facial Expert</span>
          </div>

          <div className="team-card">
            <div className="team-avatar">👤</div>
            <h4 className="team-name">Sana Malik</h4>
            <p className="team-role">Partner</p>
            <span className="team-badge">Nail &amp; Beauty Lead</span>
          </div>
        </div>

        <p className="team-note">
          Backed by a full team of 30+ trained specialists across hair, skin, and nails.
        </p>
      </section>

      {/* Stats Bar */}
      <section className="stats-section">
        <div className="stats-bar">
          <div className="stat-item">
            <p className="stat-number">5+</p>
            <p className="stat-label">YEARS EXPERIENCE</p>
          </div>
          <div className="stat-item">
            <p className="stat-number">500+</p>
            <p className="stat-label">HAPPY CLIENTS</p>
          </div>
          <div className="stat-item">
            <p className="stat-number">100%</p>
            <p className="stat-label">CERTIFIED STYLISTS</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <h2 className="cta-heading">Ready to experience it yourself?</h2>
        <p className="cta-subtext">
          Book your first appointment and see why our clients keep coming back.
        </p>
        <Link to="/booking" className="btn-primary cta-btn">Book a Visit</Link>
      </section>
    </div>
  );
}

export default About;