import { useState } from 'react';
import '../CSS/Home2.css';

export default function Home() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'login', 'signup'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    organization: '',
    confirmPassword: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      setIsLoggedIn(true);
      setCurrentView('home');
      setFormData({ email: '', password: '', name: '', organization: '', confirmPassword: '' });
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (formData.email && formData.password && formData.password === formData.confirmPassword) {
      setIsLoggedIn(true);
      setCurrentView('home');
      setFormData({ email: '', password: '', name: '', organization: '', confirmPassword: '' });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // ==================== HOME PAGE ====================
  if (currentView === 'home') {
    return (
      <div className="home-wrapper">
        {/* HERO SECTION */}
        <div className="hero-section">
          {/* Animated background shapes */}
          <div className="animated-background">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>
          </div>

          {/* Navigation */}
          <nav className="navigation">
            <div className="nav-container">
              <div className="logo">
                <div className="logo-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <span className="logo-text">POSHARA</span>
              </div>
              
              <div className="nav-links">
                <a href="#mission">Mission</a>
                <a href="#impact">Impact</a>
                <a href="#how">How It Works</a>
              </div>
              
              <div className="nav-buttons">
                {isLoggedIn ? (
                  <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
                ) : (
                  <>
                    <button className="btn btn-outline" onClick={() => setCurrentView('login')}>Login</button>
                    <button className="btn btn-primary" onClick={() => setCurrentView('signup')}>Sign Up</button>
                  </>
                )}
              </div>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="hero-content">
            <div className="hero-badge">
              🌍 Fighting Food Waste Together
            </div>

            <h1 className="hero-title">
              Nourishing Communities,<br />
              <span className="highlight">One Meal</span> at a Time
            </h1>

            <p className="hero-description">
              POSHARA connects surplus food from restaurants, farms, and retailers 
              with communities in need. Together, we're creating a world where no 
              meal goes to waste and no one goes hungry.
            </p>

            <div className="hero-actions">
              <button className="btn btn-white btn-large" onClick={() => setCurrentView('signup')}>
                <span>Start Donating</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <button className="btn btn-outline-white btn-large">Learn More</button>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-value">250K+</div>
                <div className="stat-label">Meals Redistributed</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">500+</div>
                <div className="stat-label">Partner Organizations</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">100+</div>
                <div className="stat-label">Cities Served</div>
              </div>
            </div>
          </div>

          {/* Wave SVG */}
          <div className="wave-transition">
            <svg viewBox="0 0 1440 120" fill="none">
              <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
            </svg>
          </div>
        </div>

        {/* MISSION SECTION */}
        <section id="mission" className="section mission-section">
          <div className="section-container">
            <div className="section-header">
              <div className="badge">Our Mission</div>
              <h2 className="section-title">
                Creating <span className="gradient-text">Impact</span> That Matters
              </h2>
              <p className="section-subtitle">
                POSHARA is on a mission to transform the way we think about food waste 
                and food insecurity. Every meal saved is a step towards a better tomorrow.
              </p>
            </div>

            <div className="mission-grid">
              <div className="mission-card">
                <div className="card-icon icon-orange">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 6l-9.5 9.5-5-5L1 18"/>
                  </svg>
                </div>
                <h3>Reduce Food Waste</h3>
                <p>We rescue perfectly good food from going to landfills, reducing environmental impact and methane emissions.</p>
              </div>

              <div className="mission-card">
                <div className="card-icon icon-blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h3>Feed Communities</h3>
                <p>Connecting surplus food with families, shelters, and community centers to ensure no one goes hungry.</p>
              </div>

              <div className="mission-card">
                <div className="card-icon icon-green">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a9 9 0 0 0-9 9c0 5.25 9 13 9 13s9-7.75 9-13a9 9 0 0 0-9-9z"/>
                    <circle cx="12" cy="11" r="3"/>
                  </svg>
                </div>
                <h3>Sustainable Future</h3>
                <p>Building a circular food economy that benefits both people and planet through innovative redistribution.</p>
              </div>
            </div>
          </div>
        </section>

        {/* IMPACT SECTION */}
        <section id="impact" className="section impact-section">
          <div className="section-container">
            <div className="section-header">
              <div className="badge badge-blue">Real Impact</div>
              <h2 className="section-title">
                Numbers That Tell Our <span className="gradient-text-blue">Story</span>
              </h2>
              <p className="section-subtitle">
                Every day, POSHARA makes a tangible difference in communities across the nation.
              </p>
            </div>
            
            <div className="impact-stats">
              <div className="impact-stat stat-orange">
                <div className="impact-value">15M</div>
                <div className="impact-label">Pounds of Food Saved</div>
              </div>
              <div className="impact-stat stat-pink">
                <div className="impact-value">100K</div>
                <div className="impact-label">Families Helped</div>
              </div>
              <div className="impact-stat stat-green">
                <div className="impact-value">50M</div>
                <div className="impact-label">CO2 Emissions Reduced</div>
              </div>
              <div className="impact-stat stat-blue">
                <div className="impact-value">98%</div>
                <div className="impact-label">Food Quality Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how" className="section how-section">
          <div className="section-container">
            <div className="section-header">
              <div className="badge">How It Works</div>
              <h2 className="section-title">
                Simple Steps, <span className="gradient-text">Big Impact</span>
              </h2>
              <p className="section-subtitle">
                Our streamlined process makes food redistribution easy, efficient, and impactful.
              </p>
            </div>

            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-icon icon-orange">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <div className="step-label">Step 1</div>
                <h3>Food Donors Connect</h3>
                <p>Restaurants, grocery stores, and farms sign up to donate surplus food through our easy-to-use platform.</p>
              </div>

              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-icon icon-purple">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13"/>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                </div>
                <div className="step-label">Step 2</div>
                <h3>We Collect & Transport</h3>
                <p>Our network of volunteers and logistics partners safely collect and transport food to where it's needed most.</p>
              </div>

              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-icon icon-pink">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <div className="step-label">Step 3</div>
                <h3>Communities Receive</h3>
                <p>Food reaches families, shelters, and community centers, ensuring no one goes hungry and nothing goes to waste.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="cta-section">
          <div className="cta-background">
            <div className="cta-blob cta-blob-1"></div>
            <div className="cta-blob cta-blob-2"></div>
          </div>
          
          <div className="cta-content">
            <h2 className="cta-title">Let's Build a Better Future Together</h2>
            <p className="cta-description">
              Join thousands of businesses, organizations, and volunteers who are making 
              a difference in their communities. Get updates, stories, and ways to get involved.
            </p>

            <div className="email-form">
              <svg className="email-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input type="email" placeholder="Enter your email address" className="email-input" />
              <button className="btn btn-gradient">
                <span>Subscribe</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            <div className="awards">
              <div className="award-item">
                <div className="award-icon">🌟</div>
                <div className="award-label">Featured by Forbes</div>
              </div>
              <div className="award-item">
                <div className="award-icon">🏆</div>
                <div className="award-label">Impact Award 2024</div>
              </div>
              <div className="award-item">
                <div className="award-icon">🌍</div>
                <div className="award-label">UN Recognized</div>
              </div>
              <div className="award-item">
                <div className="award-icon">⭐</div>
                <div className="award-label">4.9/5 Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-grid">
              <div className="footer-column">
                <div className="footer-logo">
                  <div className="footer-logo-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <span>POSHARA</span>
                </div>
                <p className="footer-desc">
                  Connecting surplus food with communities in need. Together, we're creating a world where no meal goes to waste.
                </p>
                <div className="social-links">
                  <a href="#" className="social-icon">f</a>
                  <a href="#" className="social-icon">t</a>
                  <a href="#" className="social-icon">in</a>
                  <a href="#" className="social-icon">ig</a>
                </div>
              </div>

              <div className="footer-column">
                <h3>Quick Links</h3>
                <ul>
                  <li><a href="#">About Us</a></li>
                  <li><a href="#">Our Mission</a></li>
                  <li><a href="#">How It Works</a></li>
                  <li><a href="#">Impact Stories</a></li>
                  <li><a href="#">Volunteer</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h3>Get Involved</h3>
                <ul>
                  <li><a href="#">Donate Food</a></li>
                  <li><a href="#">Partner With Us</a></li>
                  <li><a href="#">Become a Volunteer</a></li>
                  <li><a href="#">Corporate Partnerships</a></li>
                  <li><a href="#">Start a Chapter</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h3>Contact Us</h3>
                <ul className="contact-list">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>123 Food Drive, New York, NY 10001</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <span>+1 (555) 123-4567</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span>hello@poshara.org</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="footer-bottom">
              <p>© 2024 POSHARA. All rights reserved.</p>
              <div className="footer-links">
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

  // ==================== LOGIN PAGE ====================
  if (currentView === 'login') {
    return (
      <div className="auth-page">
        <button className="back-btn" onClick={() => setCurrentView('home')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </button>

        <div className="auth-card">
          <div className="auth-logo-wrapper">
            <div className="auth-logo">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>

          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your POSHARA account</p>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-field">
              <label>Email</label>
              <div className="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label>Password</label>
              <div className="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="link">Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-gradient btn-full">Sign In</button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <button className="btn btn-social btn-full">
            <svg viewBox="0 0 24 24" className="google-logo">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="auth-footer-text">
            Don't have an account?{' '}
            <button onClick={() => setCurrentView('signup')} className="link">Sign up</button>
          </p>
        </div>
      </div>
    );
  }

  // ==================== SIGNUP PAGE ====================
  if (currentView === 'signup') {
    return (
      <div className="auth-page">
        <button className="back-btn" onClick={() => setCurrentView('home')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </button>

        <div className="auth-card">
          <div className="auth-logo-wrapper">
            <div className="auth-logo">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>

          <h2 className="auth-title">Join POSHARA</h2>
          <p className="auth-subtitle">Create an account to start making a difference</p>

          <form onSubmit={handleSignup} className="auth-form">
            <div className="form-field">
              <label>Full Name</label>
              <div className="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label>Email</label>
              <div className="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label>Organization (Optional)</label>
              <div className="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M3 9h18M9 21V9"/>
                </svg>
                <input
                  type="text"
                  placeholder="Restaurant, NGO, etc."
                  value={formData.organization}
                  onChange={(e) => setFormData({...formData, organization: e.target.value})}
                />
              </div>
            </div>

            <div className="form-field">
              <label>Password</label>
              <div className="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label className="checkbox">
                <input type="checkbox" required />
                <span className="terms">
                  I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                </span>
              </label>
            </div>

            <button type="submit" className="btn btn-gradient btn-full">Create Account</button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <button className="btn btn-social btn-full">
            <svg viewBox="0 0 24 24" className="google-logo">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="auth-footer-text">
            Already have an account?{' '}
            <button onClick={() => setCurrentView('login')} className="link">Sign in</button>
          </p>
        </div>
      </div>
    );
  }
}
































// import React, { useEffect, useRef, useState } from "react";
// import "../CSS/Home.css";
// import Slider from "../components/Slider";
// import Footer from "../components/Footer";
// import Navbar from "../components/Navbar"

// function Home() {
//   const statsRef = useRef([]);
//   const [scrollY, setScrollY] = useState(0);
//   const [isMapVisible, setIsMapVisible] = useState(false);

//   useEffect(() => {
//     // Smooth scroll behavior
//     document.documentElement.style.scrollBehavior = 'smooth';

//     // Scroll effect for parallax
//     const handleScroll = () => {
//       setScrollY(window.scrollY);
//     };
//     window.addEventListener("scroll", handleScroll);

//     // Intersection Observer for animations
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add("visible");
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );

//     // Observe all animated elements
//     document.querySelectorAll(".animate-on-scroll").forEach((el) => {
//       observer.observe(el);
//     });

//     // Counter animation for stats
//     const animateCounter = (element) => {
//       const target = parseInt(element.getAttribute("data-count"));
//       const duration = 2000;
//       const step = target / (duration / 16);
//       let current = 0;

//       const timer = setInterval(() => {
//         current += step;
//         if (current >= target) {
//           element.textContent = target;
//           clearInterval(timer);
//         } else {
//           element.textContent = Math.floor(current);
//         }
//       }, 16);
//     };

//     // Observe stats for counter animation
//     const statsObserver = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             const counter = entry.target.querySelector("[data-count]");
//             if (counter && counter.textContent === "0") {
//               animateCounter(counter);
//             }
//           }
//         });
//       },
//       { threshold: 0.5 }
//     );

//     statsRef.current.forEach((stat) => {
//       if (stat) statsObserver.observe(stat);
//     });

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       observer.disconnect();
//       statsObserver.disconnect();
//     };
//   }, []);

//   // Smooth scroll to section
//   const scrollToSection = (sectionId) => {
//     const element = document.getElementById(sectionId);
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   };

//   return (
//     <>
//     <Navbar/>
//       <div className="home-page">
//         {/* Floating Particles */}
//         <div className="particles-container">
//           {[...Array(20)].map((_, i) => (
//             <div
//               key={i}
//               className="particle"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 animationDelay: `${Math.random() * 5}s`,
//                 animationDuration: `${15 + Math.random() * 10}s`,
//               }}
//             />
//           ))}
//         </div>

//         {/* Hero Section */}
//         <section className="hero-section" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
//           <div className="hero-content animate-on-scroll">
//             <div className="badge">
//               <span className="badge-dot"></span>
//               Reducing Food Waste Together
//             </div>

//             <h1 className="hero-title">
//               Connect. Share.
//               <br />
//               <span className="gradient-text">Save Food.</span>
//             </h1>

//             <p className="hero-subtitle">
//               Join the movement to reduce food waste and feed those in need.
//               <br />
//               Together, we can make a lasting impact on our community.
//             </p>

//             {/* Action Buttons */}
//             <div className="hero-actions">
//               <button className="primary-btn" onClick={() => scrollToSection('how-it-works')}>
//                 <span>Get Started</span>
//                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//                   <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>
//               </button>
//               <button className="secondary-btn" onClick={() => scrollToSection('impact-stats')}>
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <polygon points="3 11 22 2 13 21 11 13 3 11" />
//                 </svg>
//                 <span>View Our Impact</span>
//               </button>
//             </div>
//           </div>

//           {/* Hero Image
//           <div className="image-frame">
//             <img
//               src="/photos/home.jpg"
//               className="hero-image"
//               alt="Food donation"
//               loading="lazy"
//             />
//             {/* Floating Cards *
//             <div className="floating-card floating-card-1">
//               <div className="card-icon">📊</div>
//               <div className="card-text">
//                 <strong>Real-time</strong>
//                 <span>Tracking</span>
//               </div>
//             </div>
//             <div className="floating-card floating-card-2">
//               <div className="card-icon">⚡</div>
//               <div className="card-text">
//                 <strong>Instant</strong>
//                 <span>Connect</span>
//               </div>
//             </div>
//           </div> */}
//         </section>

//         {/* How It Works Section */}
//         <section id="how-it-works" className="how-it-works-section">
//           <div className="how-it-works-header animate-on-scroll">
//             <h2>How It Works</h2>
//             <p>Simple steps to make a big difference</p>
//           </div>

//           <div className="timeline">
//             <div className="timeline-item animate-on-scroll">
//               <div className="timeline-marker">1</div>
//               <div className="timeline-content">
//                 <div className="timeline-icon">
//                   <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//                     <circle cx="9" cy="7" r="4" />
//                     <line x1="19" y1="8" x2="19" y2="14" />
//                     <line x1="22" y1="11" x2="16" y2="11" />
//                   </svg>
//                 </div>
//                 <h3>Sign Up</h3>
//                 <p>Create your account as a restaurant, NGO, or volunteer in minutes</p>
//               </div>
//             </div>

//             <div className="timeline-item animate-on-scroll">
//               <div className="timeline-marker">2</div>
//               <div className="timeline-content">
//                 <div className="timeline-icon">
//                   <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
//                     <circle cx="12" cy="10" r="3" />
//                   </svg>
//                 </div>
//                 <h3>Connect</h3>
//                 <p>Match with nearby partners based on location and availability</p>
//               </div>
//             </div>

//             <div className="timeline-item animate-on-scroll">
//               <div className="timeline-marker">3</div>
//               <div className="timeline-content">
//                 <div className="timeline-icon">
//                   <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <path d="M12 2L2 7l10 5 10-5-10-5z" />
//                     <path d="M2 17l10 5 10-5" />
//                     <path d="M2 12l10 5 10-5" />
//                   </svg>
//                 </div>
//                 <h3>Share Food</h3>
//                 <p>Donate or receive food with real-time coordination and tracking</p>
//               </div>
//             </div>

//             <div className="timeline-item animate-on-scroll">
//               <div className="timeline-marker">4</div>
//               <div className="timeline-content">
//                 <div className="timeline-icon">
//                   <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//                     <polyline points="22 4 12 14.01 9 11.01" />
//                   </svg>
//                 </div>
//                 <h3>Make Impact</h3>
//                 <p>Track your contribution and see lives changed through your efforts</p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Stats Section */}
//         <section id="impact-stats" className="stats-section">
//           <div className="stats-header animate-on-scroll">
//             <h2>Our Impact</h2>
//             <p>Making a real difference in our community</p>
//           </div>

//           <div className="stats-grid">
//             <div className="stat-card animate-on-scroll" ref={(el) => (statsRef.current[0] = el)}>
//               <div className="stat-icon-container">
//                 <svg className="stat-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
//                   <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
//                   <line x1="12" y1="22.08" x2="12" y2="12" />
//                 </svg>
//               </div>
//               <div className="stat-content">
//                 <h3 className="stat-number">
//                   <span data-count="1200">0</span>
//                   <span className="stat-unit">kg</span>
//                 </h3>
//                 <p className="stat-label">Food Saved</p>
//                 <div className="stat-progress">
//                   <div className="stat-progress-bar" style={{ width: '85%' }}></div>
//                 </div>
//               </div>
//             </div>

//             <div className="stat-card animate-on-scroll" ref={(el) => (statsRef.current[1] = el)}>
//               <div className="stat-icon-container">
//                 <svg className="stat-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
//                   <circle cx="9" cy="7" r="4" />
//                   <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
//                   <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//                 </svg>
//               </div>
//               <div className="stat-content">
//                 <h3 className="stat-number">
//                   <span data-count="30">0</span>
//                   <span className="stat-unit">+</span>
//                 </h3>
//                 <p className="stat-label">NGOs Connected</p>
//                 <div className="stat-progress">
//                   <div className="stat-progress-bar" style={{ width: '70%' }}></div>
//                 </div>
//               </div>
//             </div>

//             <div className="stat-card animate-on-scroll" ref={(el) => (statsRef.current[2] = el)}>
//               <div className="stat-icon-container">
//                 <svg className="stat-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
//                   <polyline points="9 22 9 12 15 12 15 22" />
//                 </svg>
//               </div>
//               <div className="stat-content">
//                 <h3 className="stat-number">
//                   <span data-count="50">0</span>
//                   <span className="stat-unit">+</span>
//                 </h3>
//                 <p className="stat-label">Restaurants Partnered</p>
//                 <div className="stat-progress">
//                   <div className="stat-progress-bar" style={{ width: '90%' }}></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Features Section */}
//         <section className="features-section">
//           <div className="features-header animate-on-scroll">
//             <h2>Why Choose Us</h2>
//             <p>Powerful features that make food sharing seamless</p>
//           </div>
//           <div className="features-grid">
//             <div className="feature-card animate-on-scroll">
//               <div className="feature-icon">
//                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <circle cx="12" cy="12" r="10" />
//                   <polyline points="12 6 12 12 16 14" />
//                 </svg>
//               </div>
//               <h3>Real-Time Tracking</h3>
//               <p>Monitor food donations and pickups in real-time with live updates and notifications</p>
//             </div>

//             <div className="feature-card animate-on-scroll">
//               <div className="feature-icon">
//                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
//                   <circle cx="12" cy="10" r="3" />
//                 </svg>
//               </div>
//               <h3>Location-Based Matching</h3>
//               <p>Smart algorithms connect nearby restaurants with NGOs for efficient food distribution</p>
//             </div>

//             <div className="feature-card animate-on-scroll">
//               <div className="feature-icon">
//                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//                 </svg>
//               </div>
//               <h3>Verified Partners</h3>
//               <p>All NGOs and restaurants are verified to ensure safe and reliable food sharing</p>
//             </div>

//             <div className="feature-card animate-on-scroll">
//               <div className="feature-icon">
//                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M3 3v18h18" />
//                   <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
//                 </svg>
//               </div>
//               <h3>Impact Analytics</h3>
//               <p>Track your contribution with detailed analytics and reports on food saved</p>
//             </div>

//             <div className="feature-card animate-on-scroll">
//               <div className="feature-icon">
//                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
//                 </svg>
//               </div>
//               <h3>Instant Communication</h3>
//               <p>Built-in messaging system for seamless coordination between all parties</p>
//             </div>

//             <div className="feature-card animate-on-scroll">
//               <div className="feature-icon">
//                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
//                   <path d="M13.73 21a2 2 0 0 1-3.46 0" />
//                 </svg>
//               </div>
//               <h3>Smart Notifications</h3>
//               <p>Get instant alerts when food is available or when donations are needed nearby</p>
//             </div>
//           </div>
//         </section>
//       <Slider/>
//       </div>
//       <Footer />
//     </>
//   );
// }

// export default Home;








