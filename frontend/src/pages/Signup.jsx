import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, MapPin, Building2, AlertCircle, CheckCircle } from "lucide-react";
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
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">
          <h2 className="signup-title">Create Account</h2>

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
                className="input-field password-field"
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
                className="input-field password-field"
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

          <p className="login-link">
            Already have an account?{" "}
            <a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;