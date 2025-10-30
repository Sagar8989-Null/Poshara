import React from "react";
import "../CSS/Home.css";
import Slider from "../components/slider";

function Home() {
  return (
    <>
      <div className="home-page">
        {/* Floating Background Shapes */}
        <div className="background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>

        {/* Hero Title Section */}
        <div className="hero-title">
          <h1>Connect. Share. Save Food.</h1>
          <p>Join the movement to reduce food waste and feed those in need</p>
        </div>

        {/* Image Section */}
        <div className="home-image">
          <div className="image-wrapper">
            <img
              src="/photos/home.jpg"
              alt="Food donation concept"
              className="hero-image"
            />
            <div className="image-decoration"></div>
          </div>
        </div>

        {/* Call-to-Action Buttons */}
        <div className="home-container">
          <div className="cta-buttons">
            <button className="cta-btn">
              <span className="btn-icon"></span>
              <span className="btn-text">Join as Restaurant</span>
            </button>
            <button className="cta-btn">
              <span className="btn-icon"></span>
              <span className="btn-text">Join as NGO</span>
            </button>
            <button className="cta-btn">
              <span className="btn-icon"></span>
              <span className="btn-text">Join as Volunteer</span>
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <h2>1200 kg</h2>
            <p>Food Saved</p>
            <div className="stat-decoration"></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏢</div>
            <h2>30+</h2>
            <p>NGOs Connected</p>
            <div className="stat-decoration"></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🍴</div>
            <h2>50+</h2>
            <p>Restaurants Partnered</p>
            <div className="stat-decoration"></div>
          </div>
        </section>

        {/* Wave Decoration */}
        <div className="wave-decoration">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </div>
    <Slider/>
    </>
  );
}

export default Home;