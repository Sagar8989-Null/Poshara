import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, MapPin, Building2, AlertCircle, CheckCircle, UserPlus } from "lucide-react";
import "../CSS/Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "volunteer",
    latitude: "",
    longitude: ""
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          latitude: formData.latitude || null,
          longitude: formData.longitude || null
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Account created successfully! ✅");
        setMessageType("success");
        
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        setMessage(data.message || "Signup failed");
        setMessageType("error");
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error — check connection.");
      setMessageType("error");
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {/* Animated background */}
      <div className="background-animation">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="signup-card">
        <div className="signup-header">
          <div className="logo-container">
            <UserPlus className="logo-icon" />
          </div>
          <h2 className="signup-title">Create Account</h2>
          <p className="signup-subtitle">Join us to make a difference</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-group">
            <User className="input-icon" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <Mail className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="toggle-password"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="input-group">
            <Building2 className="input-icon" />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="select-field"
              disabled={isLoading}
            >
              <option value="volunteer">Volunteer</option>
              <option value="ngo">NGO</option>
              <option value="restaurant">Restaurant</option>
            </select>
          </div>

          <div className="location-group">
            <div className="input-group">
              <MapPin className="input-icon" />
              <input
                type="text"
                name="latitude"
                placeholder="Latitude (optional)"
                value={formData.latitude}
                onChange={handleChange}
                className="input-field"
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <MapPin className="input-icon" />
              <input
                type="text"
                name="longitude"
                placeholder="Longitude (optional)"
                value={formData.longitude}
                onChange={handleChange}
                className="input-field"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="terms">
            <label className="terms-label">
              <input type="checkbox" required />
              <span className="terms-text">
                I agree to the <a href="/terms" className="link">Terms of Service</a> and{" "}
                <a href="/privacy" className="link">Privacy Policy</a>
              </span>
            </label>
          </div>

          <button
            type="submit"
            className={`submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {message && (
          <div className={`message ${messageType === "success" ? "success" : "error"}`}>
            {messageType === "success" ? (
              <CheckCircle size={18} className="message-icon" />
            ) : (
              <AlertCircle size={18} className="message-icon" />
            )}
            <span>{message}</span>
          </div>
        )}

        <div className="divider">
          <span>Or continue with</span>
        </div>

        <div className="social-login">
          <button type="button" className="social-button google">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button type="button" className="social-button facebook">
            <svg width="20" height="20" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        <p className="login-link">
          Already have an account?{" "}
          <a href="/login" className="link">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;