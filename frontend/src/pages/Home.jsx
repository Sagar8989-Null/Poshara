import React, { useEffect, useRef } from "react";
import "../CSS/Home.css";
import Slider from "../components/slider";
import Footer from "../components/Footer";
// import Footer from "./components/Footer";


function Home() {
  const statsRef = useRef([]);

  useEffect(() => {
    // Intersection Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all animated elements
    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    // Counter animation for stats
    const animateCounter = (element) => {
      const target = parseInt(element.getAttribute("data-count"));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          element.textContent = target;
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current);
        }
      }, 16);
    };

    // Observe stats for counter animation
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target.querySelector("[data-count]");
            if (counter && counter.textContent === "0") {
              animateCounter(counter);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    statsRef.current.forEach((stat) => {
      if (stat) statsObserver.observe(stat);
    });

    return () => {
      observer.disconnect();
      statsObserver.disconnect();
    };
  }, []);

  return (
    <>
      <div className="home-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content animate-on-scroll">
            <div className="badge">
              <span className="badge-dot"></span>
              Reducing Food Waste Together
            </div>
            
            <h1 className="hero-title">
              Connect. Share.
              <br />
              <span className="gradient-text">Save Food.</span>
            </h1>
            
            <p className="hero-subtitle">
              Join the movement to reduce food waste and feed those in need.
              <br />
              Together, we can make a lasting impact on our community.
            </p>
          </div>

          {/* Hero Image */}
          <div className="hero-image-container animate-on-scroll">
            <div className="image-frame">
              <img
                src="/photos/home.jpg"
                alt="Food donation concept"
                className="hero-image"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section animate-on-scroll">
          <div className="cta-grid">
            <div className="cta-card">
              <div className="cta-icon-wrapper">
                <svg className="cta-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                  <path d="M7 2v20"/>
                  <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
                </svg>
              </div>
              <h3>Join as Restaurant</h3>
              <p>Share your surplus food and reduce waste</p>
              <button className="cta-button">
                Get Started
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="cta-card">
              <div className="cta-icon-wrapper">
                <svg className="cta-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>Join as NGO</h3>
              <p>Receive donations to feed those in need</p>
              <button className="cta-button">
                Get Started
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="cta-card">
              <div className="cta-icon-wrapper">
                <svg className="cta-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <h3>Join as Volunteer</h3>
              <p>Help deliver food and make an impact</p>
              <button className="cta-button">
                Get Started
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-header animate-on-scroll">
            <h2>Our Impact</h2>
            <p>Making a real difference in our community</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card animate-on-scroll" ref={(el) => (statsRef.current[0] = el)}>
              <div className="stat-icon-container">
                <svg className="stat-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <div className="stat-content">
                <h3 className="stat-number">
                  <span data-count="1200">0</span>
                  <span className="stat-unit">kg</span>
                </h3>
                <p className="stat-label">Food Saved</p>
                <div className="stat-progress">
                  <div className="stat-progress-bar" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>

            <div className="stat-card animate-on-scroll" ref={(el) => (statsRef.current[1] = el)}>
              <div className="stat-icon-container">
                <svg className="stat-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                  <line x1="9" y1="21" x2="9" y2="9"/>
                </svg>
              </div>
              <div className="stat-content">
                <h3 className="stat-number">
                  <span data-count="30">0</span>
                  <span className="stat-unit">+</span>
                </h3>
                <p className="stat-label">NGOs Connected</p>
                <div className="stat-progress">
                  <div className="stat-progress-bar" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>

            <div className="stat-card animate-on-scroll" ref={(el) => (statsRef.current[2] = el)}>
              <div className="stat-icon-container">
                <svg className="stat-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
                  <line x1="9" y1="9" x2="9.01" y2="9"/>
                  <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
              </div>
              <div className="stat-content">
                <h3 className="stat-number">
                  <span data-count="50">0</span>
                  <span className="stat-unit">+</span>
                </h3>
                <p className="stat-label">Restaurants Partnered</p>
                <div className="stat-progress">
                  <div className="stat-progress-bar" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Decorative Wave */}
        <div className="wave-decoration">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </div>

      <Slider />
      <Footer />
    </>
  );
}

export default Home;