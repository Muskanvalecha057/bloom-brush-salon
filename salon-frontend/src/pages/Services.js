import { useState, useRef, useEffect } from "react";
import "./Services.css";

const categoryMeta = [
  { id: "haircut", icon: "✂️", title: "Hair Cut", desc: "Precision cuts for every style." },
  { id: "haircolor", icon: "🎨", title: "Hair Color", desc: "Tailored color, roots to full transformation." },
  { id: "manicure", icon: "💅", title: "Manicure & Pedicure", desc: "Polished hands and feet." },
  { id: "nails", icon: "💎", title: "Nails", desc: "Extensions, art, and finishing touches." },
  { id: "facial", icon: "❤️", title: "Facial", desc: "Restorative skin treatments for every skin type." },
  { id: "threading", icon: "〰️", title: "Threading & Waxing", desc: "Clean, precise hair removal for face and body." },
];

function Services() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const detailRef = useRef(null);

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
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (id) => {
    setActiveCategory(id);
    setTimeout(() => {
      if (detailRef.current) {
        detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const activeMeta = categoryMeta.find((cat) => cat.id === activeCategory);
  const activeServices = allServices.filter((s) => s.category === activeCategory);

  return (
    <div className="services-page">
      <section className="services-hero">
        <p className="services-tag">— OUR SERVICES</p>
        <h2 className="services-heading">Choose a category</h2>
        <p className="services-subtext">
          Explore our services, from quick touch-ups to full transformations.
        </p>
      </section>

      <section className="category-grid">
        {categoryMeta.map((cat) => (
          <div
            key={cat.id}
            className={`category-card ${activeCategory === cat.id ? "active" : ""}`}
            onClick={() => handleCategoryClick(cat.id)}
          >
            <div className="category-icon">{cat.icon}</div>
            <h3 className="category-title">{cat.title}</h3>
            <p className="category-desc">{cat.desc}</p>
            {activeCategory === cat.id && (
              <span className="selected-badge">● SELECTED</span>
            )}
          </div>
        ))}
      </section>

      {loading && <p>Loading services...</p>}

      {activeMeta && (
        <section className="detail-section" ref={detailRef}>
          <div className="detail-header">
            <div className="detail-icon-circle">{activeMeta.icon}</div>
            <div>
              <h3 className="detail-title">{activeMeta.title}</h3>
              <p className="detail-count">{activeServices.length} services</p>
            </div>
          </div>

          <div className="service-list">
            {activeServices.map((s, i) => (
              <div className={`service-row ${i % 2 === 0 ? "row-pink" : "row-white"}`} key={s.id}>
                <div className="service-info">
                  <p className="service-name">{s.service_name}</p>
                  <p className="service-detail">{s.detail}</p>
                </div>
                <div className="service-meta">
                  <span className="service-duration">{s.duration}</span>
                  <span className="service-price">{s.price}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Services;