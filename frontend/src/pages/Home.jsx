import React, { useEffect, useRef, useState } from "react";
import "../CSS/Home.css";
import Slider from "../components/slider";
import Footer from "../components/Footer";

function Home() {
  const statsRef = useRef([]);
  const [scrollY, setScrollY] = useState(0);
  const [isMapVisible, setIsMapVisible] = useState(false);

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Scroll effect for parallax
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);

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
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      statsObserver.disconnect();
    };
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
    <Navbar/>
      <div className="home-page">
        {/* Floating Particles */}
        <div className="particles-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Section */}
        <section className="hero-section" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
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

            {/* Action Buttons */}
            <div className="hero-actions">
              <button className="primary-btn" onClick={() => scrollToSection('how-it-works')}>
                <span>Get Started</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="secondary-btn" onClick={() => scrollToSection('impact-stats')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                <span>View Our Impact</span>
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="image-frame">
            <img
              src="/photos/home.jpg"
              className="hero-image"
              alt="Food donation"
              loading="lazy"
            />
            {/* Floating Cards */}
            <div className="floating-card floating-card-1">
              <div className="card-icon">📊</div>
              <div className="card-text">
                <strong>Real-time</strong>
                <span>Tracking</span>
              </div>
            </div>
            <div className="floating-card floating-card-2">
              <div className="card-icon">⚡</div>
              <div className="card-text">
                <strong>Instant</strong>
                <span>Connect</span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="how-it-works-section">
          <div className="how-it-works-header animate-on-scroll">
            <h2>How It Works</h2>
            <p>Simple steps to make a big difference</p>
          </div>

          <div className="timeline">
            <div className="timeline-item animate-on-scroll">
              <div className="timeline-marker">1</div>
              <div className="timeline-content">
                <div className="timeline-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                </div>
                <h3>Sign Up</h3>
                <p>Create your account as a restaurant, NGO, or volunteer in minutes</p>
              </div>
            </div>

            <div className="timeline-item animate-on-scroll">
              <div className="timeline-marker">2</div>
              <div className="timeline-content">
                <div className="timeline-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h3>Connect</h3>
                <p>Match with nearby partners based on location and availability</p>
              </div>
            </div>

            <div className="timeline-item animate-on-scroll">
              <div className="timeline-marker">3</div>
              <div className="timeline-content">
                <div className="timeline-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3>Share Food</h3>
                <p>Donate or receive food with real-time coordination and tracking</p>
              </div>
            </div>

            <div className="timeline-item animate-on-scroll">
              <div className="timeline-marker">4</div>
              <div className="timeline-content">
                <div className="timeline-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3>Make Impact</h3>
                <p>Track your contribution and see lives changed through your efforts</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="impact-stats" className="stats-section">
          <div className="stats-header animate-on-scroll">
            <h2>Our Impact</h2>
            <p>Making a real difference in our community</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card animate-on-scroll" ref={(el) => (statsRef.current[0] = el)}>
              <div className="stat-icon-container">
                <svg className="stat-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
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
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
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

        {/* Features Section */}
        <section className="features-section">
          <div className="features-header animate-on-scroll">
            <h2>Why Choose Us</h2>
            <p>Powerful features that make food sharing seamless</p>
          </div>
          <div className="features-grid">
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3>Real-Time Tracking</h3>
              <p>Monitor food donations and pickups in real-time with live updates and notifications</p>
            </div>

            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3>Location-Based Matching</h3>
              <p>Smart algorithms connect nearby restaurants with NGOs for efficient food distribution</p>
            </div>

            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3>Verified Partners</h3>
              <p>All NGOs and restaurants are verified to ensure safe and reliable food sharing</p>
            </div>

            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18" />
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                </svg>
              </div>
              <h3>Impact Analytics</h3>
              <p>Track your contribution with detailed analytics and reports on food saved</p>
            </div>

            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3>Instant Communication</h3>
              <p>Built-in messaging system for seamless coordination between all parties</p>
            </div>

            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <h3>Smart Notifications</h3>
              <p>Get instant alerts when food is available or when donations are needed nearby</p>
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

      <Footer />
    </>
  );
}

export default Home;