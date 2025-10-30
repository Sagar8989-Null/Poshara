import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Utensils, Sparkles } from "lucide-react";
import "../CSS/Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Animated particles background */}
      <div className="navbar-particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
      </div>

      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          <Link to="/" className="logo">
            <div className="logo-icon-wrapper">
              <Utensils className="logo-icon" />
              <Sparkles className="sparkle-icon" size={12} />
            </div>
            <span className="logo-text">Poshara</span>
            <div className="logo-underline"></div>
          </Link>

          <button
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className="menu-toggle-inner">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </span>
          </button>

          <div className={`nav-buttons ${isMenuOpen ? "active" : ""}`}>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <button className={`nav-btn home-btn ${isActive("/") ? "active" : ""}`}>
                <span className="btn-icon"></span>
                <span className="btn-label">Home</span>
                <div className="btn-shine"></div>
              </button>
            </Link>
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <button className={`nav-btn login-btn ${isActive("/login") ? "active" : ""}`}>
                <span className="btn-icon"></span>
                <span className="btn-label">Login</span>
                <div className="btn-shine"></div>
              </button>
            </Link>
            <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
              <button className={`nav-btn signup-btn ${isActive("/signup") ? "active" : ""}`}>
                <span className="btn-icon"></span>
                <span className="btn-label">Signup</span>
                <div className="btn-shine"></div>
              </button>
            </Link>
          </div>
        </div>

        {/* Animated border bottom */}
        <div className="navbar-border"></div>
      </nav>

      {isMenuOpen && (
        <div className="overlay" onClick={toggleMenu}>
          <div className="overlay-pattern"></div>
        </div>
      )}
    </>
  );
}

export default Navbar;