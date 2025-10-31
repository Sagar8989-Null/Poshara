import React, { useState, useEffect } from "react";
import "../CSS/NgoDash.css";
import { Menu, Ruler, Leaf, Box, Users, X } from "lucide-react";

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
          <div className="filter-card">
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
          </div>

          <div className="filter-card">
            <span className="filter-title">
              <Leaf className="icon green" />
              Food Type
            </span>
            <div className="toggle-group">
              <button
                onClick={() => handleButtonToggle("foodType", "Veg")}
                className={`toggle-btn ${
                  foodType === "Veg" ? "active" : ""
                }`}
              >
                Veg
              </button>
              <button
                onClick={() => handleButtonToggle("foodType", "Non-Veg")}
                className={`toggle-btn ${
                  foodType === "Non-Veg" ? "active" : ""
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
                className={`toggle-btn ${
                  packaging === "Unpackaged" ? "active" : ""
                }`}
              >
                Unpackaged
              </button>
              <button
                onClick={() => handleButtonToggle("packaging", "Packaged")}
                className={`toggle-btn ${
                  packaging === "Packaged" ? "active" : ""
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
function DonationItem({ donation, onAccept }) {
  const statusClass =
    donation.status === "picked_up" ? "accepted" : "waiting";

  return (
    <div className="donation-item">
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
            onClick={() => onAccept(donation.donation_id)}
          >
            Accept
          </button>
        )}
      </div>
    </div>
  );
}

// --- Main Content ---
function MainContent({ donations, onMenuClick, onAccept }) {
  return (
    <main className="main-content">
      <div className="header">
        <Menu className="menu-icon md:hidden" onClick={onMenuClick} />
        <h2 id="ngo-dash">NGO Dashboard</h2>
      </div>

      <h3 className="section-title">Available Donations</h3>

      <section className="donations-section">
        <div className="donations-list">
          {donations.length > 0 ? (
            donations.map((donation) => (
              <DonationItem
                key={donation.donation_id}
                donation={donation}
                onAccept={onAccept}
              />
            ))
          ) : (
            <p className="empty-text">No donations available right now.</p>
          )}
        </div>
      </section>

      <section className="map-section">
        <h3>Map View</h3>
        <div className="map-placeholder">
          <span>Map View Placeholder</span>
        </div>
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
  const [filters, setFilters] = useState({
    distance: 25,
    foodType: "Veg",
    packaging: "Unpackaged",
    servings: 10,
  });

  const [donations, setDonations] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const ngoId = 1; // 🔹 Replace later with logged-in NGO ID

  // 🔹 Fetch live donations
  useEffect(() => {
    fetch("http://localhost:5000/api/donations/available")
      .then((res) => res.json())
      .then((data) => setDonations(data))
      .catch((err) => console.error("Error fetching donations:", err));
  }, []);

  // 🔹 Accept a donation
  const handleAccept = async (donationId) => {
    try {
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
      setDonations((prev) =>
        prev.filter((donation) => donation.donation_id !== donationId)
      );
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
        />
      </div>
      <Footer />
    </div>
  );
}
