import React, { useState, useEffect } from "react";
import "../CSS/VolDash.css";
import AnnaPurnaMap from "../components/Map"; // ✅ optional map
import { Truck, CheckCircle, Loader2 } from "lucide-react";

export default function VolDash() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const volunteerId = 1; // ⚠️ Replace with actual logged-in volunteer ID later

  // ✅ Fetch all donations accepted by NGOs
  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/donations/accepted");
      const data = await res.json();
      setDonations(data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // ✅ Volunteer accepts a donation for delivery
  const handleAccept = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/volunteer/accept/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ volunteer_id: volunteerId }),
      });

      if (!res.ok) throw new Error("Failed to accept donation");
      alert("✅ You’ve accepted this delivery!");
      fetchDonations();
    } catch (err) {
      console.error(err);
      alert("Failed to accept donation");
    }
  };

  // ✅ Volunteer marks delivery complete
  const handleDeliver = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/volunteer/deliver/${id}`, {
        method: "PUT",
      });

      if (!res.ok) throw new Error("Failed to mark as delivered");
      alert("🎉 Donation marked as delivered!");
      fetchDonations();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="volunteer-dashboard">
      <div className="header">
        <h1>Volunteer Dashboard</h1>
        <p className="subtitle">Deliver goodness from restaurants to NGOs 🚗💚</p>
      </div>

      {/* Map Section */}
      <div className="map-section">
        <AnnaPurnaMap />
      </div>

      {/* Donations Section */}
      <div className="donations-container">
        <h2>Available Deliveries</h2>

        {loading ? (
          <div className="loading">
            <Loader2 className="spinner" /> Loading...
          </div>
        ) : donations.length === 0 ? (
          <p>No active deliveries available right now.</p>
        ) : (
          donations.map((donation) => (
            <div key={donation.donation_id} className="donation-card">
              <div className="donation-info">
                <h3>{donation.food_type}</h3>
                <p>Quantity: {donation.quantity} {donation.unit}</p>
                <p>Status: <strong>{donation.status}</strong></p>
                <p>
                  Expiry: {new Date(donation.expiry_time).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="donation-actions">
                {donation.status === "accepted" && !donation.volunteer_id && (
                  <button className="accept-btn" onClick={() => handleAccept(donation.donation_id)}>
                    <Truck className="icon" /> Accept for Delivery
                  </button>
                )}

                {donation.status === "picked_up" && donation.volunteer_id === volunteerId && (
                  <button className="deliver-btn" onClick={() => handleDeliver(donation.donation_id)}>
                    <CheckCircle className="icon" /> Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
