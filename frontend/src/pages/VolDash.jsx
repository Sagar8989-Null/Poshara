import React, { useState, useEffect } from "react";
import "../CSS/VolDash.css";
import { CheckCircle, MapPin, Truck, Clock, Loader2 } from "lucide-react";
import VolunteerDashMap from "../components/VolunteerDashMap";

export default function VolDash() {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState(null);

  // 🧩 Load user
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  // 🧠 Fetch donations accepted by NGOs (available for pickup)
  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/volunteer/accepted");
      if (!res.ok) throw new Error("Failed to fetch donations");
      const data = await res.json();
      setDonations(data);
    } catch (err) {
      console.error("Error fetching donations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const volunteerId = user?.user_id;

  // 🚚 Accept for delivery
  const handleAccept = async (id) => {
    try {
      if (!volunteerId) return alert("Please log in first!");
      const res = await fetch(`http://localhost:5000/api/volunteer/accept/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ volunteer_id: volunteerId }),
      });
      if (!res.ok) throw new Error("Failed to accept donation");
      alert("✅ Delivery accepted!");
      fetchDonations();
    } catch (err) {
      console.error(err);
      alert("Error accepting donation");
    }
  };

  // ✅ Mark as delivered
  const handleDeliver = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/volunteer/deliver/${id}`, { method: "PUT" });
      if (!res.ok) throw new Error("Failed to update delivery");
      alert("🎉 Marked as delivered!");
      fetchDonations();
    } catch (err) {
      console.error(err);
      alert("Failed to mark delivered");
    }
  };

  const stats = {
    total: donations.length,
    accepted: donations.filter((d) => d.status === "accepted").length,
    picked_up: donations.filter((d) => d.status === "picked_up" && d.volunteer_id === volunteerId).length,
    delivered: donations.filter((d) => d.status === "delivered" && d.volunteer_id === volunteerId).length,
  };

  return (
    <div className="volunteer-dashboard">
      <div className="vol-header">
        <h1>Volunteer Dashboard</h1>
        {user && (
          <div className="user-profile-section">
            <p className="welcome-text">
              Welcome, {user.name}! 🌸 Ready to deliver smiles today?
            </p>
            <div className="user-details">
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>User ID:</strong> {user.user_id}</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="vol-stats">
        <div className="stat-card total"><span>Total</span><h2>{stats.total}</h2></div>
        <div className="stat-card claimed"><span>Accepted</span><h2>{stats.accepted}</h2></div>
        <div className="stat-card delivered"><span>My Deliveries</span><h2>{stats.picked_up + stats.delivered}</h2></div>
      </div>

      <div className="vol-content">
        {/* Donation Cards */}
        <div className="donations-panel">
          <h2>Available Deliveries</h2>
          {loading ? (
            <div className="loading"><Loader2 className="spinner" /> Loading...</div>
          ) : donations.length === 0 ? (
            <p className="no-data">No active deliveries right now.</p>
          ) : (
            donations.map((donation) => (
              <div className="donation-card" key={donation.donation_id}>
                <div className="donation-info">
                  <h3>{donation.food_name}</h3>
                  <p>Variety: {donation.food_variety}</p>
                  <p>Category: {donation.food_category}</p>
                  <p>Quantity: {donation.quantity} {donation.unit}</p>
                  <p><Clock size={14} /> Expires: {new Date(donation.expiry_time).toLocaleString()}</p>
                  <p>Status: <strong>{donation.status}</strong></p>
                </div>

                <div className="donation-actions">
                  {donation.status === "accepted" && !donation.volunteer_id && (
                    <button className="accept-btn" onClick={() => handleAccept(donation.donation_id)}>
                      <Truck size={16} /> Accept for Delivery
                    </button>
                  )}
                  {donation.status === "picked_up" && donation.volunteer_id === volunteerId && (
                    <button className="deliver-btn" onClick={() => handleDeliver(donation.donation_id)}>
                      <CheckCircle size={16} /> Mark as Delivered
                    </button>
                  )}
                  <button className="map-btn" onClick={() => setSelectedDonationId(donation.donation_id)}>
                    <MapPin size={16} /> View on Map
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Map Panel */}
        <div className="map-panel">
          <h2>Live Map</h2>
          {selectedDonationId ? (
            <VolunteerDashMap donationId={selectedDonationId} />
          ) : (
            <p>Select a donation to view its location 🗺️</p>
          )}
        </div>
      </div>
    </div>
  );
}
