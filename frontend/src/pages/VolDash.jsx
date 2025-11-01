import React, { useState, useEffect } from "react";
import "../CSS/VolDash.css";
<<<<<<< HEAD
import AnnaPurnaMap from "../components/Map"; // ✅ optional map
import { Truck, CheckCircle, Loader2 } from "lucide-react";
=======
import { CheckCircle, MapPin, Truck, Clock, Upload } from "lucide-react";
import VolunteerDashMap from "../components/VolunteerDashMap";
>>>>>>> f73c70de2bfbb3578175e657dfdc38a1ee7254f0

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
  
  // Get selected donation ID for map
  const selectedDonationId = selectedDonation?.donation_id || null;

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
<<<<<<< HEAD
=======
        {!user && <p>Welcome back 🌸 Ready to deliver smiles today?</p>}
      </div>

      {/* Stats */}
      <div className="vol-stats">
        <div className="stat-card total">
          <span>Total Donations</span>
          <h2>{stats.total}</h2>
        </div>
        <div className="stat-card claimed">
          <span>Claimed</span>
          <h2>{stats.claimed}</h2>
        </div>
        <div className="stat-card delivered">
          <span>Delivered</span>
          <h2>{stats.delivered}</h2>
        </div>
      </div>

      <div className="vol-content">
        {/* Available Donations */}
        <div className="donations-panel">
          <h2>Available Donations</h2>
          {donations.length === 0 ? (
            <p className="no-data">No donations available right now.</p>
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
                </div>
                <div className="donation-actions">
                  <button
                    className="claim-btn"
                    onClick={() => handleClaim(donation)}
                  >
                    Claim
                  </button>
                  <button
                    className="map-btn"
                    onClick={() => handleViewOnMap(donation)}
                  >
                    <MapPin size={16} /> View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Claimed Donations */}
        <div className="claimed-panel">
          <h2>My Deliveries</h2>
          {claimed.length === 0 ? (
            <p className="no-data">You haven’t claimed any donations yet.</p>
          ) : (
            claimed.map((c) => (
              <div className="donation-card" key={c.id}>
                <div className="donation-info">
                  <h3>{c.food_type}</h3>
                  <p>Status: {c.status}</p>
                  {c.status === "Claimed" && (
                    <button
                      className="pickup-btn"
                      onClick={() => handlePickedUp(c.id)}
                    >
                      Picked Up
                    </button>
                  )}
                  {c.status === "Picked Up" && (
                    <>
                      <button
                        className="deliver-btn"
                        onClick={() => handleDelivered(c.id)}
                      >
                        Mark Delivered
                      </button>
                      <label className="upload-label">
                        <Upload size={14} /> Upload Proof
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleProofUpload(e, c.id)}
                          style={{ display: "none" }}
                        />
                      </label>
                    </>
                  )}
                  {c.status === "Delivered" && (
                    <p className="delivered-status">
                      <CheckCircle size={16} color="#34d399" /> Delivered
                    </p>
                  )}
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
>>>>>>> f73c70de2bfbb3578175e657dfdc38a1ee7254f0
      </div>
    </div>
  );
}
