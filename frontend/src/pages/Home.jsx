import React from 'react';
import '../CSS/Home.CSS';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="hero">
        {/* Animated background shapes */}
        <div className="hero-bg">
          <div className="hero-blob hero-blob-1"></div>
          <div className="hero-blob hero-blob-2"></div>
          <div className="hero-blob hero-blob-3"></div>
        </div>

        {/* Navigation */}
        <nav>
          <div className="nav-container">
            <div className="logo-container animate-fade-in-up">
              <div className="logo-circle">
                <svg className="icon icon-fill" style={{ color: '#ec4899' }} viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <span className="logo-text">POSHARA</span>
            </div>
            
            <div className="nav-links animate-fade-in-up">
              <a href="#mission">Mission</a>
              <a href="#impact">Impact</a>
              <a href="#how">How It Works</a>
            </div>
            
            <button className="nav-btn animate-fade-in-up">Get Involved</button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="hero-content">
          <div className="hero-grid">
            <div>
              <div className="badge animate-fade-in-up delay-200">
                <span>🌍 Fighting Food Waste Together</span>
              </div>

              <h1 className="hero-title animate-fade-in-up delay-300">
                Nourishing Communities,<br/>
                <span className="highlight">One Meal</span> at a Time
              </h1>

              <p className="hero-description animate-fade-in-up delay-400">
                POSHARA connects surplus food from restaurants, farms, and retailers 
                with communities in need. Together, we're creating a world where no 
                meal goes to waste and no one goes hungry.
              </p>

              <div className="hero-buttons animate-fade-in-up delay-500">
                <button className="btn-primary">
                  <span>Start Donating</span>
                  <svg className="icon" viewBox="0 0 24 24">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
                <button className="btn-secondary">Learn More</button>
              </div>

              <div className="hero-stats animate-fade-in delay-600">
                <div className="stat-item">
                  <div className="stat-number">250K+</div>
                  <div className="stat-label">Meals Redistributed</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Partner Organizations</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">100+</div>
                  <div className="stat-label">Cities Served</div>
                </div>
              </div>
            </div>

            <div className="hero-image-container animate-scale-in delay-400">
              <div style={{ position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1757332334664-83bff99e7a43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
                  alt="Fresh colorful vegetables"
                  className="hero-image"
                />
                <div className="image-badge">
                  <div className="badge-icon">✓</div>
                  <div>
                    <div className="badge-text-title">Fresh & Nutritious</div>
                    <div className="badge-text-subtitle">Quality Guaranteed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave transition */}
        <div className="wave">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Mission Section */}
      <section id="mission" className="mission-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">Our Mission</div>
            <h2 className="section-title">
              Creating <span className="gradient-text">Impact</span> That Matters
            </h2>
            <p className="section-description">
              POSHARA is on a mission to transform the way we think about food waste 
              and food insecurity. Every meal saved is a step towards a better tomorrow.
            </p>
          </div>

          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon mission-icon-1 animate-float">
                <svg className="icon" viewBox="0 0 24 24" style={{ width: '32px', height: '32px' }}>
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
              </div>
              <h3 className="mission-title">Reduce Food Waste</h3>
              <p className="mission-description">
                We rescue perfectly good food from going to landfills, reducing environmental impact and methane emissions.
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-icon mission-icon-2 animate-float" style={{ animationDelay: '0.3s' }}>
                <svg className="icon" viewBox="0 0 24 24" style={{ width: '32px', height: '32px' }}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="mission-title">Feed Communities</h3>
              <p className="mission-description">
                Connecting surplus food with families, shelters, and community centers to ensure no one goes hungry.
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-icon mission-icon-3 animate-float" style={{ animationDelay: '0.6s' }}>
                <svg className="icon" viewBox="0 0 24 24" style={{ width: '32px', height: '32px' }}>
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
              </div>
              <h3 className="mission-title">Sustainable Future</h3>
              <p className="mission-description">
                Building a circular food economy that benefits both people and planet through innovative redistribution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="impact-section">
        <div className="section-container">
          <div className="impact-grid">
            <div>
              <div className="section-badge" style={{ background: 'linear-gradient(to right, #3b82f6, #9333ea)' }}>Real Impact</div>
              <h2 className="section-title">
                Numbers That Tell Our <span className="gradient-text" style={{ background: 'linear-gradient(to right, #3b82f6, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Story</span>
              </h2>
              <p className="section-description" style={{ marginBottom: '32px' }}>
                Every day, POSHARA makes a tangible difference in communities across the nation. 
                Our innovative food redistribution network turns waste into opportunity, 
                connecting those with excess to those in need.
              </p>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value orange animate-pulse">15M</div>
                  <div className="stat-label">Pounds of Food Saved</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value pink animate-pulse" style={{ animationDelay: '0.2s' }}>100K</div>
                  <div className="stat-label">Families Helped</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value green animate-pulse" style={{ animationDelay: '0.4s' }}>50M</div>
                  <div className="stat-label">CO2 Emissions Reduced</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value blue animate-pulse" style={{ animationDelay: '0.6s' }}>98%</div>
                  <div className="stat-label">Food Quality Rating</div>
                </div>
              </div>
            </div>

            <div className="impact-images">
              <div className="image-col">
                <img
                  src="https://images.unsplash.com/photo-1763570645098-371723617ee9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
                  alt="Community food sharing"
                  className="impact-image"
                />
                <div className="testimonial-card yellow">
                  <div className="testimonial-icon">🌟</div>
                  <p className="testimonial-text">
                    "POSHARA has transformed how we manage surplus food. It's making a real difference!"
                  </p>
                </div>
              </div>
              <div className="image-col">
                <div className="testimonial-card green">
                  <div className="testimonial-icon">💚</div>
                  <p className="testimonial-text">
                    "Thanks to POSHARA, we've been able to feed 1000+ families every month."
                  </p>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1758272134196-1ab895629bce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
                  alt="People enjoying food"
                  className="impact-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="how-it-works-section">
        <div className="decorative-bg decorative-bg-1"></div>
        <div className="decorative-bg decorative-bg-2"></div>
        
        <div className="section-container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="section-header">
            <div className="section-badge" style={{ background: 'linear-gradient(to right, #fb923c, #ec4899)' }}>How It Works</div>
            <h2 className="section-title">
              Simple Steps, <span className="gradient-text">Big Impact</span>
            </h2>
            <p className="section-description">
              Our streamlined process makes food redistribution easy, efficient, and impactful.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon step-icon-1 animate-bounce">
                <svg className="icon" viewBox="0 0 24 24" style={{ width: '40px', height: '40px' }}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <div className="step-number step-icon-1 animate-pulse">1</div>
              <div className="step-label">Step 1</div>
              <h3 className="step-title">Food Donors Connect</h3>
              <p className="step-description">
                Restaurants, grocery stores, and farms sign up to donate surplus food through our easy-to-use platform.
              </p>
            </div>

            <div className="step-card">
              <div className="step-icon step-icon-2 animate-bounce" style={{ animationDelay: '0.3s' }}>
                <svg className="icon" viewBox="0 0 24 24" style={{ width: '40px', height: '40px' }}>
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
              <div className="step-number step-icon-2 animate-pulse" style={{ animationDelay: '0.2s' }}>2</div>
              <div className="step-label">Step 2</div>
              <h3 className="step-title">We Collect & Transport</h3>
              <p className="step-description">
                Our network of volunteers and logistics partners safely collect and transport food to where it's needed most.
              </p>
            </div>

            <div className="step-card">
              <div className="step-icon step-icon-3 animate-bounce" style={{ animationDelay: '0.6s' }}>
                <svg className="icon icon-fill" viewBox="0 0 24 24" style={{ width: '40px', height: '40px' }}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <div className="step-number step-icon-3 animate-pulse" style={{ animationDelay: '0.4s' }}>3</div>
              <div className="step-label">Step 3</div>
              <h3 className="step-title">Communities Receive</h3>
              <p className="step-description">
                Food reaches families, shelters, and community centers, ensuring no one goes hungry and nothing goes to waste.
              </p>
            </div>
          </div>

          <div className="cta-box">
            <img
              src="https://images.unsplash.com/photo-1628717341663-0007b0ee2597?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
              alt="Food delivery volunteer"
              className="cta-image"
            />
            <h3 className="cta-title">Ready to Make a Difference?</h3>
            <p className="cta-description">
              Whether you're a business with surplus food or an organization serving communities, 
              join POSHARA today and be part of the solution.
            </p>
            <button className="cta-button">Join Our Network</button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-blob cta-blob-1"></div>
        <div className="cta-blob cta-blob-2"></div>

        <div className="cta-content">
          <h2 className="cta-heading">
            Let's Build a Better<br/>
            Future Together
          </h2>
          <p className="cta-text">
            Join thousands of businesses, organizations, and volunteers who are making 
            a difference in their communities. Get updates, stories, and ways to get involved.
          </p>

          <div className="email-form">
            <svg className="email-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <input
              type="email"
              placeholder="Enter your email address"
              className="email-input"
            />
            <button className="email-button">
              <span>Subscribe</span>
              <svg className="icon" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

          <div className="achievements">
            <div className="achievement">
              <div className="achievement-icon">🌟</div>
              <div className="achievement-text">Featured by Forbes</div>
            </div>
            <div className="achievement">
              <div className="achievement-icon">🏆</div>
              <div className="achievement-text">Impact Award 2024</div>
            </div>
            <div className="achievement">
              <div className="achievement-icon">🌍</div>
              <div className="achievement-text">UN Recognized</div>
            </div>
            <div className="achievement">
              <div className="achievement-icon">⭐</div>
              <div className="achievement-text">4.9/5 Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">
                <div className="footer-logo-circle">
                  <svg className="icon icon-fill" style={{ color: 'white', width: '24px', height: '24px' }} viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                <span className="footer-logo-text">POSHARA</span>
              </div>
              <p className="footer-description">
                Connecting surplus food with communities in need. Together, we're creating a world where no meal goes to waste.
              </p>
              <div className="social-links">
                <a href="#" className="social-link">f</a>
                <a href="#" className="social-link">t</a>
                <a href="#" className="social-link">in</a>
                <a href="#" className="social-link">ig</a>
              </div>
            </div>

            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Our Mission</a></li>
                <li><a href="#">How It Works</a></li>
                <li><a href="#">Impact Stories</a></li>
                <li><a href="#">Volunteer</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>Get Involved</h3>
              <ul className="footer-links">
                <li><a href="#">Donate Food</a></li>
                <li><a href="#">Partner With Us</a></li>
                <li><a href="#">Become a Volunteer</a></li>
                <li><a href="#">Corporate Partnerships</a></li>
                <li><a href="#">Start a Chapter</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>Contact Us</h3>
              <div className="contact-item">
                <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span className="contact-text">123 Food Drive, Community Center, New York, NY 10001</span>
              </div>
              <div className="contact-item">
                <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span className="contact-text">+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span className="contact-text">hello@poshara.org</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2024 POSHARA. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}