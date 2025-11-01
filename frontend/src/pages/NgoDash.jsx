import React, { useState, useEffect } from "react";
import "../CSS/NgoDash.css";
import { Menu, Ruler, Leaf, Box, Users, X } from "lucide-react";
import NgoDashMap from "../components/NgoDashMap";

// --- Sidebar Component ---
function Sidebar({ filters, setFilters, applyFilters, isOpen, onClose }) {
  const { distance, foodType, packaging, servings } = filters;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleButtonToggle = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) document.body.classList.add("sidebar-open");
    else document.body.classList.remove("sidebar-open");
  }, [isOpen]);

  return (
    <>
      {isOpen && <div className="overlay md:hidden" onClick={onClose}></div>}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Filters</h2>
          <button onClick={onClose} className="close-btn md:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="filters-container">
          {/* <div className="filter-card">
            <div className="filter-header">
              <label htmlFor="distance">
                <Ruler className="icon purple" />
                Distance
              </label>
              <span className="distance-value">{distance} km</span>
            </div>
            <input
              type="range"
              id="distance"
              name="distance"
              min="0"
              max="50"
              value={distance}
              onChange={handleInputChange}
              className="range-slider"
            />
          </div> */}

          <div className="filter-card">
            <span className="filter-title">
              <Leaf className="icon green" />
              Food Type
            </span>
            <div className="toggle-group">
              <button
                onClick={() => handleButtonToggle("foodType", "Veg")}
                className={`toggle-btn ${foodType === "Veg" ? "active" : ""
                  }`}
              >
                Veg
              </button>
              <button
                onClick={() => handleButtonToggle("foodType", "Non-Veg")}
                className={`toggle-btn ${foodType === "Non-Veg" ? "active" : ""
                  }`}
              >
                Non-Veg
              </button>
            </div>
          </div>

          <div className="filter-card">
            <span className="filter-title">
              <Box className="icon blue" />
              Packaging
            </span>
            <div className="toggle-group">
              <button
                onClick={() => handleButtonToggle("packaging", "Unpackaged")}
                className={`toggle-btn ${packaging === "Unpackaged" ? "active" : ""
                  }`}
              >
                Unpackaged
              </button>
              <button
                onClick={() => handleButtonToggle("packaging", "Packaged")}
                className={`toggle-btn ${packaging === "Packaged" ? "active" : ""
                  }`}
              >
                Packaged
              </button>
            </div>
          </div>

          <div className="filter-card">
            <label htmlFor="servings" className="filter-title">
              <Users className="icon yellow" />
              Minimum Servings
            </label>
            <input
              type="number"
              id="servings"
              name="servings"
              min="1"
              step="1"
              value={servings}
              onChange={handleInputChange}
              className="number-input"
            />
          </div>

          <div className="apply-btn-container">
            <button onClick={applyFilters} className="apply-btn">
              Apply Filters
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// --- Donation Item ---
function DonationItem({ donation, onAccept, onSelect }) {
  const statusClass =
    donation.status === "picked_up" || donation.status === "accepted" ? "accepted" : "waiting";

  return (
    <div className="donation-item" onClick={() => onSelect && onSelect(donation.donation_id)}>
      <div>
        <h3>{donation.food_type}</h3>
        <p>
          Quantity: {donation.quantity} {donation.unit}
        </p>
        <p>Expires: {new Date(donation.expiry_time).toLocaleString()}</p>
      </div>
      <div className="donation-actions">
        <span className={`status ${statusClass}`}>{donation.status}</span>
        {donation.status === "available" && (
          <button
            className="accept-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAccept(donation.donation_id);
            }}
          >
            Accept
          </button>
        )}
      </div>
    </div>
  );
}

// --- Main Content ---
function MainContent({ donations, onMenuClick, onAccept, user, selectedDonationId, onSelectDonation }) {
  return (
    <main className="main-content">
      <div className="header">
        <Menu className="menu-icon md:hidden" onClick={onMenuClick} />
        <h2 id="ngo-dash">NGO Dashboard</h2>
      </div>

      {user && (
        <div className="user-profile-section">
          <p className="welcome-text">Welcome, {user.name}!</p>
          <div className="user-details">
            <p><strong>Role:</strong> {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}</p>
            <p><strong>User ID:</strong> {user.user_id}</p>
            {/* {user.latitude && user.longitude && (
              <p><strong>Location:</strong> {user.latitude.toFixed(4)}, {user.longitude.toFixed(4)}</p>
            )} */}
          </div>
        </div>
      )}

      <h3 className="section-title">Available Donations</h3>

      <section className="donations-section">
        <div className="donations-list">
          {donations.length > 0 ? (
            donations.map((donation) => (
              <DonationItem
                key={donation.donation_id}
                donation={donation}
                onAccept={onAccept}
                onSelect={onSelectDonation}
              />
            ))
          ) : (
            <p className="empty-text">No donations available right now.</p>
          )}
        </div>
      </section>

      <section className="map-section">
        <h3>Map View</h3>
        {selectedDonationId ? (
          <NgoDashMap donationId={selectedDonationId} />
        ) : (
          <div className="map-placeholder">
            <span>Click on a donation to view it on the map</span>
          </div>
        )}
      </section>
    </main>
  );
}

// --- Footer ---
function Footer() {
  return (
    <footer className="footer">© 2025 Poshara - Connecting Goodness.</footer>
  );
}

// --- Main Dashboard Component ---
export default function NgoDash() {
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({
    distance: 25,
    foodType: "Veg",
    packaging: "Unpackaged",
    servings: 10,
  });

  const [donations, setDonations] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState(null);

  // Load user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const [availableRes, acceptedRes] = await Promise.all([
          fetch("http://localhost:5000/api/donations/available"),
          fetch("http://localhost:5000/api/donations/accepted"),
        ]);

        const availableData = await availableRes.json();
        const acceptedData = await acceptedRes.json();

        // 🧩 Merge both
        const merged = [...availableData, ...acceptedData];
        setDonations(merged);
      } catch (err) {
        console.error("Error fetching donations:", err);
      }
    };

    fetchDonations();

     const interval = setInterval(fetchDonations, 3000);
  return () => clearInterval(interval);
  }, []);



  // 🔹 Accept a donation
  const handleAccept = async (donationId) => {
    try {
      const userData = localStorage.getItem("user");
      const parsedUser = userData ? JSON.parse(userData) : null;
      const ngoId = parsedUser?.user_id;
      
      if (!ngoId) {
        alert("User not found. Please login again.");
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/donations/${donationId}/accept`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ngo_id: ngoId }),
        }
      );

      if (!res.ok) throw new Error("Failed to accept donation");

      alert("Donation accepted successfully!");
      const ngoIdForUpdate = parsedUser?.user_id;
      setDonations((prev) =>
        prev.map((donation) =>
          donation.donation_id === donationId
            ? { ...donation, status: "accepted", ngo_id: ngoIdForUpdate }
            : donation
        )
      );
      
      // Select the accepted donation to show on map
      setSelectedDonationId(donationId);
      
      // Emit socket event for real-time update
      if (window.socket) {
        window.socket.emit("donation-accepted", {
          donationId,
          ngoLocation: user && user.latitude && user.longitude ? {
            lat: user.latitude,
            lng: user.longitude
          } : null
        });
      }
    } catch (err) {
      console.error(err);
      alert("Error accepting donation");
    }
  };

  const applyFilters = () => {
    // currently static — you can later filter donations based on filters
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  return (
    <div className="ngo-container">
      <div className="content-wrapper">
        <Sidebar
          filters={filters}
          setFilters={setFilters}
          applyFilters={applyFilters}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <MainContent
          donations={donations}
          onMenuClick={() => setIsSidebarOpen(true)}
          onAccept={handleAccept}
          user={user}
          selectedDonationId={selectedDonationId}
          onSelectDonation={setSelectedDonationId}
        />
      </div>
      <Footer />
    </div>
  );
}
