import React, { useState } from "react";
import OCRImageExtractor from "../components/OCR";

function RestoDash() {
  const [formData, setFormData] = useState({
    foodname: "",
    quantity: "",
    unit: "",
    expiryDate: "",
    description: "",
  });

  const [totalDonations, setTotalDonations] = useState("");
  const [availableDonations, setAvailableDonations] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setFormData({
          foodname: "",
          quantity: "",
          unit: "",
          expiryDate: "",
          description: "",
        });
      }
    } catch (err) {
      console.error(err);
      setMessage("Error submitting form");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Restaurant Dashboard 🍽️</h1>
      <p>Track your food donations and reduce waste here.</p>

      <div>Total Donations: {totalDonations}</div>
      <div>Available: {availableDonations}</div>

      <OCRImageExtractor />

      <form onSubmit={handleSubmit}>

        <label>Food Name:</label>
        <input
          type="text"
          name="foodname"
          value={formData.foodname}
          onChange={handleChange}
          required
        />
        <br /><br />

        <label>Quantity:</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
        <br /><br />

        <label>Unit:</label>
        <input
          type="number"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          required
        />
        <br /><br />

        <label>Expiry Date:</label>
        <input
          type="month"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
        />
        <br /><br />

        <label>Description:</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default RestoDash;

