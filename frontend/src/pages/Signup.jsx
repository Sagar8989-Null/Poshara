import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, MapPin, Building2, AlertCircle, CheckCircle } from "lucide-react";
import Addresslatlong from "../components/Addresslatlong";
import "../CSS/Auth.css";

function Signup() {
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
            {/* Name */}
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
                disabled={isLoading} />
            </div>

            {/* Email */}
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
                disabled={isLoading} />
            </div>

            {/* Password */}
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
                disabled={isLoading} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
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
                disabled={isLoading} />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="toggle-password"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Role */}
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

            {/* Map — show only if NGO or Restaurant */}
{(formData.role === "ngo" || formData.role === "restaurant") && (
  <div className="map-wrapper-signup">
    <p className="map-label">Set your location:</p>
    <Addresslatlong
      onLocationChange={(lat, lng) =>
        setFormData({ ...formData, latitude: lat, longitude: lng })
      }
    />
  </div>
)}

            {/* Submit */}
            <button
              type="submit"
              className={`submit-button ${isLoading ? "loading" : ""}`}
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

          {/* Message */}
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

          {/* Login Link */}
          <p className="login-link">
            Already have an account?{" "}
            <a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
