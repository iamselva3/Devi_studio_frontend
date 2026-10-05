import { useState } from "react";
import { useSettings } from "../../context/SettingsContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Pricing.css";

const CATEGORIES = [
  { id: "wedding", label: "Weddings" },
  { id: "baby", label: "Baby Photography" },
  { id: "model", label: "Model Shoots" },
  { id: "general", label: "General & Events" }
];

export default function Pricing() {
  const { settings } = useSettings();
  const pricingPlans = settings?.pricingPlans || [];

  const availableCategories = CATEGORIES.filter(cat => 
    pricingPlans.some(plan => plan.category === cat.id)
  );

  if (pricingPlans.length === 0) {
    return (
      <div style={{ paddingTop: "120px", minHeight: "100vh", textAlign: "center" }}>
        <div className="container">
          <h1 className="heading-lg">Pricing Not Available</h1>
          <p className="body-text">Please contact us for custom quotes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pricing-page">
      {/* Header */}
      <section className="pricing-banner">
        <div className="container text-center">
          <span className="label-gold">Investment</span>
          <div className="gold-divider" />
          <h1 className="heading-lg">Pricing & <em>Packages</em></h1>
          <p className="body-text" style={{ maxWidth: "600px", margin: "1rem auto 3rem" }}>
            Transparent pricing tailored to capture your most beautiful moments.
          </p>
        </div>
      </section>

      {/* Pricing Categories */}
      {availableCategories.map((cat, index) => {
        const catPlans = pricingPlans.filter(plan => plan.category === cat.id);
        
        return (
          <section key={cat.id} className="section-spacing" style={{ paddingTop: index === 0 ? "0" : "4rem", paddingBottom: "4rem" }}>
            <div className="container">
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <h2 className="title-section" style={{ fontSize: "2rem" }}>{cat.label}</h2>
                <div className="gold-divider" style={{ margin: "1rem auto 0" }} />
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="pricing-grid"
              >
                {catPlans.map((plan, idx) => (
                  <div key={idx} className={`pricing-card ${plan.popular ? "popular" : ""}`}>
                    {plan.popular && <div className="pricing-card__badge">Most Popular</div>}
                    <h3 className="pricing-card__title">{plan.name}</h3>
                    <div className="pricing-card__price">{plan.price}</div>
                    <div className="gold-divider" style={{ margin: "1.5rem 0" }} />
                    <ul className="pricing-card__features">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" width="18" height="18">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {feat}
                        </li>
                      ))}
                    </ul>
                    <Link to="/contact-us" className={`btn ${plan.popular ? "btn-gold" : "btn-outline"} pricing-card__btn`}>
                      Book Now
                    </Link>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
