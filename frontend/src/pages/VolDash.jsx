import React, { useState, useEffect } from "react";
import "../CSS/VolDash.css";
import { CheckCircle, MapPin, Truck, Clock, Loader2 } from "lucide-react";
import VolunteerDashMap from "../components/VolunteerDashMap";

export default function VolDash() {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState(null);

  // Load user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // ✅ Fetch all donations accepted by NGOs
  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/volunteer/accepted");
      if (!res.ok) throw new Error("Failed to fetch donations");
      const data = await res.json();
      console.log("Fetched donations:", data); // Debug log
      setDonations(data);
    } catch (error) {
      console.error("Error fetching donations:", error);
      alert("Failed to load donations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // Get volunteer ID from user
  const volunteerId = user?.user_id;

  // ✅ Volunteer accepts a donation for delivery
  const handleAccept = async (id) => {
    try {
      if (!volunteerId) {
        alert("Please login first");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/volunteer/accept/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ volunteer_id: volunteerId }),
      });

      if (!res.ok) throw new Error("Failed to accept donation");
      alert("✅ You've accepted this delivery!");
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

  // 🗺️ Select donation to view on map
  const handleViewOnMap = (donation) => {
    setSelectedDonationId(donation.donation_id);
  };

  // 📊 Calculate stats
  const stats = {
    total: donations.length,
    accepted: donations.filter(d => d.status === "accepted").length,
    picked_up: donations.filter(d => d.status === "picked_up" && d.volunteer_id === volunteerId).length,
    delivered: donations.filter(d => d.status === "delivered" && d.volunteer_id === volunteerId).length,
  };

  return (
    <div className="volunteer-dashboard">
      {/* Header */}
      <div className="vol-header">
        <h1>Volunteer Dashboard</h1>
        {user && (
          <div className="user-profile-section">
            <p className="welcome-text">Welcome, {user.name}! 🌸 Ready to deliver smiles today?</p>
            <div className="user-details">
              <p><strong>Role:</strong> {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}</p>
              <p><strong>User ID:</strong> {user.user_id}</p>
            </div>
          </div>
        )}
        {!user && <p>Welcome back 🌸 Ready to deliver smiles today?</p>}
      </div>

      {/* Stats */}
      <div className="vol-stats">
        <div className="stat-card total">
          <span>Total Available</span>
          <h2>{stats.total}</h2>
        </div>
        <div className="stat-card claimed">
          <span>Accepted</span>
          <h2>{stats.accepted}</h2>
        </div>
        <div className="stat-card delivered">
          <span>My Deliveries</span>
          <h2>{stats.picked_up + stats.delivered}</h2>
        </div>
      </div>

      <div className="vol-content">
        {/* Available Donations */}
        <div className="donations-panel">
          <h2>Available Deliveries</h2>
          {loading ? (
            <div className="loading">
              <Loader2 className="spinner" /> Loading...
            </div>
          ) : donations.length === 0 ? (
            <p className="no-data">No active deliveries available right now.</p>
          ) : (
            donations.map((donation) => (
              <div className="donation-card" key={donation.donation_id}>
                <div className="donation-info">
                  <h3>{donation.food_type}</h3>
                  <p>
                    Quantity: {donation.quantity} {donation.unit}
                  </p>
                  <p>
                    <Clock size={14} /> Expires:{" "}
                    {new Date(donation.expiry_time).toLocaleString()}
                  </p>
                  <p>Status: <strong>{donation.status}</strong></p>
                </div>
                <div className="donation-actions">
                  {donation.status === "accepted" && !donation.volunteer_id && (
                    <button
                      className="accept-btn"
                      onClick={() => handleAccept(donation.donation_id)}
                    >
                      <Truck size={16} /> Accept for Delivery
                    </button>
                  )}
                  {donation.status === "picked_up" && donation.volunteer_id === volunteerId && (
                    <button
                      className="deliver-btn"
                      onClick={() => handleDeliver(donation.donation_id)}
                    >
                      <CheckCircle size={16} /> Mark as Delivered
                    </button>
                  )}
                  <button
                    className="map-btn"
                    onClick={() => handleViewOnMap(donation)}
                  >
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
