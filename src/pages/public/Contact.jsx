import { useState, useEffect } from "react";
import { getSettings } from "../../api/studioApi";

export default function Contact() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSettings().then(r => setSettings(r.data.data)).catch(() => {});
  }, []);

  return (
    <div className="contact-page" style={{ paddingTop: "120px", minHeight: "100vh" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span className="label-gold">Get in touch</span>
          <div className="gold-divider" />
          <h1 className="heading-lg">Let's <em>Connect</em></h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
          <div className="card" style={{ padding: "3rem" }}>
            <h2 className="heading-md" style={{ marginBottom: "2rem" }}>Send us a message</h2>
            <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label className="input-label">Name</label>
                <input className="input" placeholder="Your Name" required />
              </div>
              <div>
                <label className="input-label">Email</label>
                <input className="input" type="email" placeholder="your@email.com" required />
              </div>
              <div>
                <label className="input-label">Message</label>
                <textarea className="input" rows="5" placeholder="Tell us about your event..." required></textarea>
              </div>
              <button type="submit" className="btn btn-gold" style={{ marginTop: "1rem", justifyContent: "center" }}>
                Send Message
              </button>
            </form>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div className="card" style={{ padding: "2rem" }}>
              <h3 style={{ marginBottom: "1rem", color: "var(--gold)" }}>Contact Information</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <p className="body-text"><strong>Email:</strong> {settings?.contactEmail || "hello@devistudio.in"}</p>
                <p className="body-text"><strong>Phone:</strong> {settings?.contactPhone || "+91 98765 43210"}</p>
                <p className="body-text"><strong>Address:</strong> {settings?.contactAddress || "Chennai, Tamil Nadu"}</p>
              </div>
            </div>
            <div className="card" style={{ padding: "2rem", flex: 1 }}>
              <h3 style={{ marginBottom: "1rem", color: "var(--gold)" }}>Follow Us</h3>
              <p className="body-text" style={{ marginBottom: "1rem" }}>Stay updated with our latest work.</p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <a href={settings?.socialLinks?.instagram || "#"} className="btn btn-outline" target="_blank" rel="noreferrer">Instagram</a>
                <a href={settings?.socialLinks?.facebook || "#"} className="btn btn-outline" target="_blank" rel="noreferrer">Facebook</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
