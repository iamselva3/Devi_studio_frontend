import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/weddings", label: "Weddings" },
  { to: "/baby-photography", label: "Baby" },
  { to: "/model-shoot", label: "Model" },
  { to: "/pricing", label: "Pricing" },
  { to: "/blog", label: "Blog" },
  { to: "/about-us", label: "About" },
  { to: "/contact-us", label: "Contact" },
];
import { useSettings } from "../../context/SettingsContext";

export default function Navbar() {
  const { settings } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""} ${menuOpen ? "navbar--menu-open" : ""}`}>
        <div className="navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none' }}>
            {settings?.logoImage ? (
              <>
                <img 
                  src={settings.logoImage} 
                  alt={settings?.studioName || "Studio Logo"} 
                  className="navbar__logo-img" 
                  style={{ 
                    height: "45px", 
                    width: settings?.logoShape === "round" ? "45px" : "auto", 
                    borderRadius: settings?.logoShape === "round" ? "50%" : "0", 
                    objectFit: settings?.logoShape === "round" ? "cover" : "contain" 
                  }} 
                />
                {settings?.logoDisplay === "logo-and-text" && (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="navbar__logo-name" style={{ fontSize: '1.2rem', lineHeight: 1.2 }}>{settings?.studioName || "Devi Studio"}</span>
                  </div>
                )}
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="navbar__logo-name">{settings?.studioName || "Devi Studio"}</span>
                <span className="navbar__logo-sub">Photography</span>
              </div>
            )}
          </Link>

          {/* Desktop Nav */}
          <ul className="navbar__links">
            {navLinks.map((link) => {
              if (link.to === "/pricing" && (!settings?.pricingPlans || settings.pricingPlans.length === 0)) {
                return null;
              }
              return (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) => `navbar__link ${isActive ? "navbar__link--active" : ""}`}
                    end={link.to === "/"}
                  >
                    {link.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* Right actions */}
          <div className="navbar__actions" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button 
              onClick={toggleTheme} 
              style={{ 
                background: "rgba(255,255,255,0.05)", 
                border: "1px solid rgba(255,255,255,0.1)", 
                color: "var(--text-primary)",
                borderRadius: "50%", 
                width: "36px", 
                height: "36px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              )}
            </button>
            <button
              className={`navbar__hamburger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${menuOpen ? "navbar__mobile--open" : ""}`} ref={menuRef}>
        <ul className="navbar__mobile-links">
          {navLinks.map((link) => {
            if (link.to === "/pricing" && (!settings?.pricingPlans || settings.pricingPlans.length === 0)) {
              return null;
            }
            return (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => `navbar__mobile-link ${isActive ? "active" : ""}`}
                  end={link.to === "/"}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
