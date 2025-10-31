import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import '../CSS/Auth.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Login successful ✅");
        setMessageType("success");
        
        // Store user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Redirect based on role
        setTimeout(() => {
          switch (data.user.role) {
            case "restaurant":
              navigate("/dashboard/restaurant");
              break;
            case "ngo":
              navigate("/dashboard/ngo");
              break;
            case "volunteer":
              navigate("/dashboard/volunteer");
              break;
            default:
              navigate("/dashboard");
          }
        }, 1500);
      } else {
        setMessage(data.message || "Login failed");
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
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Input */}
            <div className="input-group">
              <Mail className="input-icon" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="input-field"
                required
              />
            </div>

            {/* Password Input */}
            <div className="input-group">
              <Lock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="input-field password-field"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="toggle-password"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`submit-button ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div className={`message ${messageType === 'success' ? 'success' : 'error'}`}>
              {messageType === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>{message}</span>
            </div>
          )}

          {/* Signup Link */}
          <p className="signup-link">
            Don't have an account?{' '}
            <a href="/signup">Signup</a>
          </p>
        </div>
      </div>
    </div>
  );
}