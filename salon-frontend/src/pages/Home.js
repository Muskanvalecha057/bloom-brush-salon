import { Link } from "react-router-dom";
import "./Home.css";
import salonImg from "../assets/salon.png";
import { useEffect, useState } from "react";
import cutColorImg from "../assets/Cut-color.png";
import facialImg from "../assets/facial.png";
import nailsGroomingImg from "../assets/grooming.png";

function Home() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-image-wrap">
          <div className="hero-arch">
            <img
              src={salonImg}
              alt="Bloom & Brush Salon"
              className="hero-arch-img"
            />
          </div>

          <div className="hero-notify-card">
            <span className="notify-dot"></span>
            <div>
              <p className="notify-label">NOW BOOKING</p>
              <p className="notify-text">July appointments open</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`intro-section ${showIntro ? "intro-visible" : ""}`}>
        <p className="intro-tag">— HAIR &amp; BEAUTY STUDIO</p>
        <h2 className="intro-heading">
          Quiet luxury,<br />
          for every kind of beautiful.
        </h2>
        <p className="intro-text">
          A calm space where your hair, skin and self quietly come first —
          no rush, no noise, just care that shows.
        </p>

        <div className="intro-buttons">
  <Link to="/booking" className="btn-primary">Book a visit</Link>
</div>
      </section>

      <section className="category-section">
        <div className="category-header">
          <div>
            <p className="category-tag">— WHAT WE DO</p>
            <h2 className="category-heading">Care, by category</h2>
          </div>
          <a href="/services" className="view-all-link">View all services →</a>
        </div>

       <div className="category-grid">
  <Link to="/services" className="category-card">
    <div className="category-arch arch-nails">
      <img src={nailsGroomingImg} alt="Nails & Grooming" className="category-img" />
    </div>
    <h3 className="category-title">Nails &amp; Grooming</h3>
    <p className="category-desc">
      Manicures, pedicures and finishing touches for that polished look.
    </p>
  </Link>

  <Link to="/services" className="category-card">
    <div className="category-arch arch-cutcolor">
      <img src={cutColorImg} alt="Cut & Colour" className="category-img" />
    </div>
    <h3 className="category-title">Cut &amp; Colour</h3>
    <p className="category-desc">
      Precision cuts and tailored colour, from a first trim to a full transformation.
    </p>
  </Link>

  <Link to="/services" className="category-card">
    <div className="category-arch arch-facial">
      <img src={facialImg} alt="Skin & Facial" className="category-img" />
    </div>
    <h3 className="category-title">Skin &amp; Facial</h3>
    <p className="category-desc">
      Restorative facials and skin treatments suited to every skin type.
    </p>
  </Link>
</div>
      </section>

      <section className="studio-section">
        <p className="studio-tag">— OUR STUDIO</p>
        <h2 className="studio-heading">A space designed around you</h2>
        <p className="studio-text">
          Bloom &amp; Brush was built to feel unhurried — soft light, quiet music,
          and stylists who ask before they cut. No pressure, no upsell, just good work.
        </p>
        <Link to="/about" className="btn-secondary">Read our story</Link>
      </section>
    </div>
  );
}

export default Home;