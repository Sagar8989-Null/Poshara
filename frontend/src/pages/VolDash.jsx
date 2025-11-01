import React, { useState, useEffect } from "react";
import "../CSS/VolDash.css";
import { CheckCircle, MapPin, Truck, Clock, Upload } from "lucide-react";
import VolunteerDashMap from "../components/VolunteerDashMap";

function VolDash() {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [claimed, setClaimed] = useState([]);
  const [mapLocation, setMapLocation] = useState({ lat: null, lng: null });
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [proofImage, setProofImage] = useState(null);

  // Load user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // 📊 Stats
  const stats = {
    total: donations.length,
    claimed: claimed.length,
    delivered: claimed.filter((c) => c.status === "Delivered").length,
  };

  // 🌍 Fetch available donations
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/donations");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch donations");
        setDonations(data.filter((d) => d.status === "available"));
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };
    fetchDonations();
  }, []);

  // 🚴 Claim donation
  const handleClaim = (donation) => {
    if (claimed.find((c) => c.id === donation.donation_id)) {
      alert("You already claimed this donation!");
      return;
    }
    const newDonation = {
      id: donation.donation_id,
      food_type: donation.food_type,
      quantity: donation.quantity,
      unit: donation.unit,
      expiry_time: donation.expiry_time,
      status: "Claimed",
      pickup: { lat: donation.latitude, lng: donation.longitude },
    };
    setClaimed([...claimed, newDonation]);
    alert("Donation claimed successfully!");
  };

  // 🚚 Mark picked up
  const handlePickedUp = (id) => {
    setClaimed((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Picked Up" } : c))
    );
  };

  // ✅ Mark delivered
  const handleDelivered = (id) => {
    setClaimed((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Delivered" } : c))
    );
    alert("Delivery marked successful!");
  };

  // 📸 Upload proof
  const handleProofUpload = (event, id) => {
    const file = event.target.files[0];
    if (file) {
      setProofImage(URL.createObjectURL(file));
      setClaimed((prev) =>
        prev.map((c) => (c.id === id ? { ...c, proof: file.name } : c))
      );
      alert("Delivery proof uploaded successfully!");
    }
  };

  // 🗺️ Select donation on map
  const handleViewOnMap = (donation) => {
    setSelectedDonation(donation);
    setMapLocation({
      lat: donation.latitude || 19.076,
      lng: donation.longitude || 72.8777,
    });
  };
  
  // Get selected donation ID for map
  const selectedDonationId = selectedDonation?.donation_id || null;

  return (
    <div className="vol-dashboard">
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
      </div>
    </div>
  );
}

export default VolDash;
