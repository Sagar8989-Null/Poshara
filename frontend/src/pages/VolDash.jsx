import React, { useState, useEffect } from "react";
import "../CSS/VolDash.css";
import { CheckCircle, MapPin, Truck, Clock, Loader2, Menu, X } from "lucide-react";
import VolunteerDashMap from "../components/VolunteerDashMap";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // ✅ Adjust if backend runs elsewhere

/* ---------------------------- Sidebar Component ---------------------------- */
function Sidebar({ isOpen, onClose, user }) {
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    document.body.classList.toggle("sidebar-open", isOpen);
  }, [isOpen]);

  return (
    <>
      {isOpen && <div className="overlay md:hidden" onClick={onClose}></div>}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          {/* <h2>Information</h2> */}
          <button onClick={onClose} className="close-btn md:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        {user &&
          <div className="profilecontainer">
            <div className="flex">
            <div className="profilecircle"></div>
            <h2>{user.name}</h2>
            </div>
            <button onClick={() => {
              localStorage.removeItem("user");
              window.location.reload();
            }}>Logout</button>
          </div>
        }

        {/* <div className="filters-container">
          <div className="filter-card">
            <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: 600 }}>
              Volunteer Dashboard
            </h3>
            <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
              Accept deliveries and help connect food donations to those in need.
            </p>
          </div>
        </div> */}


      </aside>
    </>
  );
}

/* --------------------------- Donation Item Card --------------------------- */
function DonationItem({ donation, volunteerId, onAccept, onDeliver, onSelect }) {
  return (
    <div className="donation-item">
      <div>
        <h3>{donation.food_name}</h3>
        <p>Variety: {donation.food_variety}</p>
        <p>Category: {donation.food_category}</p>
        <p>
          Quantity: {donation.quantity} {donation.unit}
        </p>
        <p>
          <Clock size={14} style={{ display: "inline", marginRight: "0.25rem" }} />{" "}
          Expires: {new Date(donation.expiry_time).toLocaleString()}
        </p>
        <p>
          Status: <strong>{donation.status}</strong>
        </p>
      </div>

      <div className="donation-actions">
        <span
          className={`status ${donation.status === "accepted" ||
            donation.status === "picked_up" ||
            donation.status === "delivered"
            ? "accepted"
            : "waiting"
            }`}
        >
          {donation.status}
        </span>

        {/* {donation.status === "available" && !donation.volunteer_id && ( */}
        {donation.status === "accepted" && !donation.volunteer_id && (
          <button
            className="accept-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAccept(donation.donation_id);
            }}
          >
            <Truck
              size={16}
              style={{ display: "inline", marginRight: "0.25rem" }}
            />{" "}
            Accept for Delivery
          </button>
        )}

        {donation.status === "picked_up" &&
          donation.volunteer_id === volunteerId && (
            <button
              className="deliver-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDeliver(donation.donation_id);
              }}
            >
              <CheckCircle
                size={16}
                style={{ display: "inline", marginRight: "0.25rem" }}
              />{" "}
              Mark as Delivered
            </button>
          )}

        <button
          className="map-btn"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(donation.donation_id);
          }}
        >
          <MapPin
            size={16}
            style={{ display: "inline", marginRight: "0.25rem" }}
          />{" "}
          View on Map
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- Main Section ------------------------------ */
function MainContent({
  donations,
  loading,
  volunteerId,
  onMenuClick,
  onAccept,
  onDeliver,
  user,
  selectedDonationId,
  onSelectDonation,
}) {
  return (
    <main className="main-content">
      <div className="header">
        <Menu className="menu-icon md:hidden" onClick={onMenuClick} />
        <h2>Volunteer Dashboard</h2>
      </div>

      {/* {user && (
        <div className="user-profile-section">
          <p className="welcome-text">Welcome, {user.name}!</p>
          <div className="user-details">
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            <p>
              <strong>User ID:</strong> {user.user_id}
            </p>
          </div>
        </div>
      )} */}

      <h3 className="section-title">Available Deliveries</h3>

      <section className="donations-section">
        <div className="donations-list">
          {loading ? (
            <div className="loading">
              <Loader2
                className="spinner"
                style={{ animation: "spin 1s linear infinite", display: "inline-block" }}
              />{" "}
              Loading...
            </div>
          ) : donations.length > 0 ? (
            donations.map((donation) => (
              <DonationItem
                key={donation.donation_id}
                donation={donation}
                volunteerId={volunteerId}
                onAccept={onAccept}
                onDeliver={onDeliver}
                onSelect={onSelectDonation}
              />
            ))
          ) : (
            <p className="empty-text">No active deliveries right now.</p>
          )}
        </div>
      </section>

      <section className="map-section">
        <h3>Map View</h3>
        {selectedDonationId ? (
          <VolunteerDashMap donationId={selectedDonationId} />
        ) : (
          <div className="map-placeholder">
            <span>Click on a donation to view it on the map</span>
          </div>
        )}
      </section>
    </main>
  );
}

/* ---------------------------------- Footer --------------------------------- */
function Footer() {
  return <footer className="footer">© 2025 Poshara - Connecting Goodness.</footer>;
}

/* ------------------------------ Main Component ----------------------------- */
export default function VolDash() {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const volunteerId = user?.user_id;

  // ✅ Load user data
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  // ✅ Fetch donations
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

  // ✅ Live location streaming
  useEffect(() => {
    if (!user || !selectedDonationId) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        socket.emit("volunteer-location", {
          donationId: selectedDonationId,
          volunteerId: user.user_id,
          latitude,
          longitude,
        });
      },
      (err) => console.error("Location error:", err),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [selectedDonationId, user]);

  // ✅ Accept donation
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
      const res = await fetch(`http://localhost:5000/api/volunteer/deliver/${id}`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Failed to update delivery");
      alert("🎉 Marked as delivered!");
      fetchDonations();
    } catch (err) {
      console.error(err);
      alert("Failed to mark delivered");
    }
  };

  return (
    <div className="vol-container">
      <div className="content-wrapper">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} user={user} />
        <MainContent
          donations={donations}
          loading={loading}
          volunteerId={volunteerId}
          onMenuClick={() => setIsSidebarOpen(true)}
          onAccept={handleAccept}
          onDeliver={handleDeliver}
          user={user}
          selectedDonationId={selectedDonationId}
          onSelectDonation={setSelectedDonationId}
        />
      </div>
      <Footer />
    </div>
  );
}
