import { useState, useEffect } from "react";
import { getSettings } from "../../api/studioApi";

export default function About() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSettings().then(r => setSettings(r.data.data)).catch(() => {});
  }, []);

  return (
    <div className="about-page" style={{ paddingTop: "120px", minHeight: "100vh" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span className="label-gold">Our Story</span>
          <div className="gold-divider" />
          <h1 className="heading-lg">About <em>Devi Studio</em></h1>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          <div>
            <img src={settings?.logoUrl || "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop"} alt="About us" style={{ borderRadius: "var(--radius-lg)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }} />
          </div>
          <div>
            <h2 className="heading-md" style={{ marginBottom: "1.5rem" }}>Capturing moments that last forever</h2>
            <p className="body-text" style={{ whiteSpace: "pre-wrap", fontSize: "1.1rem" }}>
              {settings?.aboutText || "Founded with a deep love for visual storytelling, Devi Studio brings artistry and authenticity to every session. We don't just take photos — we craft memories that will be treasured for generations.\n\nOur approach is unobtrusive, artistic, and entirely focused on you. From grand celebrations to intimate moments, we are dedicated to delivering beautiful imagery."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
