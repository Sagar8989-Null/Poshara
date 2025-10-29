import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Login successful ✅");

        // Store login details for dashboard use
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("latitude", data.latitude);
        localStorage.setItem("longitude", data.longitude);
        localStorage.setItem("userId", data.user_id);

        // Redirect based on role
        if (data.role === "restaurant") {
          window.location.href = "/restodash";
        } else if (data.role === "ngo") {
          window.location.href = "/ngodash";
        } else {
          window.location.href = "/voldash";
        }
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error — check connection.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6 text-pink-700">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg transition"
          >
            Login
          </button>
        </form>
        {message && <p className="text-center text-sm text-gray-700 mt-4">{message}</p>}
        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-pink-600 font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

