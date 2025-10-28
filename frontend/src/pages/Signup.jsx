// src/components/Signup.jsx
import React, { useState } from "react";
import Addresslatlong from "../components/Addresslatlong";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "volunteer",
    latitude: "",
    longitude: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setMessage(data.message);
      if (res.ok) {
        setFormData({ name: "", email: "", password: "", role: "volunteer" });
      }
    } catch (err) {
      console.error(err);
      setMessage("Error submitting form");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        <br /><br />

        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        <br /><br />

        <label>Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        <br /><br />

        <label>Role</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="volunteer">Volunteer</option>
          <option value="restaurant">Restaurant</option>
          <option value="ngo">NGO</option>
        </select>
        <br /><br />

        {formData.role !== "volunteer" && (
          <Addresslatlong
            onLocationChange={(lat, lng) =>
              setFormData({ ...formData, latitude: lat, longitude: lng })
            }
          />
        )}
        <button type="submit">Signup</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Signup;
