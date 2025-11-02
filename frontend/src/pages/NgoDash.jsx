import React, { useState, useEffect } from "react";
import "../CSS/NgoDash.css";
import { Menu, Leaf, Box, Users, X } from "lucide-react";
import NgoDashMap from "../components/NgoDashMap";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // Adjust if backend runs elsewhere

/* ---------------------------- Sidebar Component ---------------------------- */
function Sidebar({ filters, setFilters, applyFilters, isOpen, onClose }) {
  const { foodVariety, foodCategory, servings } = filters;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleButtonToggle = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

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
          <h2>Filters</h2>
          <button onClick={onClose} className="close-btn md:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="filters-container">
          <div className="filter-card">
            <div className="filter-header">
              <label htmlFor="distance">Distance</label>
              <span className="distance-value">{filters.distance} km</span>
            </div>

            <input
              type="range"
              id="distance"
              name="distance"
              min="0"
              max="50"
              value={filters.distance}
              step="1"
              onChange={handleInputChange}
              className="range-slider"
            />
          </div>

          {/* Food Variety */}
          <div className="filter-card">
            <span className="filter-title">
              <Leaf className="icon green" style={{ marginRight: '10px' }} />
              Food Variety
            </span>
            <div className="toggle-group">
              <button
                onClick={() => handleButtonToggle("foodVariety", "Veg")}
                className={`toggle-btn ${foodVariety === "Veg" ? "active" : ""}`}
              >
                Veg
              </button>
              <button
                onClick={() => handleButtonToggle("foodVariety", "Non-Veg")}
                className={`toggle-btn ${foodVariety === "Non-Veg" ? "active" : ""}`}
              >
                Non-Veg
              </button>
            </div>
          </div>

          {/* Food Category */}
          <div className="filter-card">
            <span className="filter-title">
              <Box className="icon blue" style={{ marginRight: '10px' }} />
              Food Category
            </span>
            <div className="toggle-group">
              <button
                onClick={() => handleButtonToggle("foodCategory", "Cooked")}
                className={`toggle-btn ${foodCategory === "Cooked" ? "active" : ""}`}
              >
                Cooked
              </button>
              <button
                onClick={() => handleButtonToggle("foodCategory", "Packaged")}
                className={`toggle-btn ${foodCategory === "Packaged" ? "active" : ""}`}
              >
                Packaged
              </button>
            </div>
          </div>

          {/* Minimum Servings */}
          {/* <div className="filter-card">
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
          </div> */}

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

/* --------------------------- Donation Item Card --------------------------- */
function DonationItem({ donation, onAccept, onSelect }) {

  
  const statusClass =
    donation.status === "picked_up" || donation.status === "accepted"
      ? "accepted"
      : "waiting";

  return (
    <div className="donation-item">
      <div>
        <h3>{donation.food_name}</h3>
        <p>Variety: {donation.food_variety}</p>
        <p>Category: {donation.food_category}</p>
        <p>Quantity: {donation.quantity} {donation.unit}</p>
        <p>Distance: {donation.distance ? `${donation.distance} km` : "N/A"}</p>
        <p>
          Expires:{" "}
          {new Date(donation.expiry_time).toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
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

        <button
          className="map-btn"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(donation.donation_id);
          }}
        >
          View on Map
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- Main Section ------------------------------ */
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
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>User ID:</strong> {user.user_id}</p>
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

/* ---------------------------------- Footer --------------------------------- */
function Footer() {
  return <footer className="footer">© 2025 Poshara - Connecting Goodness.</footer>;
}

/* ------------------------------ Main Component ----------------------------- */
export default function NgoDash() {
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({
    distance: 10, // default radius in km
    foodVariety: "Veg",
    foodCategory: "Cooked",
    servings: 1,
  });

  const [donations, setDonations] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState(null);

useEffect(() => {
  if (!selectedDonationId) return; // Wait until a donation is selected

  // Join the live location room
  socket.emit("join-donation-room", selectedDonationId);

  // Listen for volunteer location updates
  socket.on("volunteer-location", (data) => {
    // Forward the live data to your map component via a custom event or state
    window.dispatchEvent(new CustomEvent("volunteer-location-update", { detail: data }));
  });

  return () => {
    socket.off("volunteer-location");
  };
}, [selectedDonationId]);

useEffect(() => {
  const handleLocationUpdate = (e) => {
    const { latitude, longitude } = e.detail;
    setVolunteerMarker({ lat: latitude, lng: longitude }); // Update map marker here
  };

  window.addEventListener("volunteer-location-update", handleLocationUpdate);
  return () => window.removeEventListener("volunteer-location-update", handleLocationUpdate);
}, []);

  // Load user info
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      // console.log("🧭 Loaded user data:", parsed);
      setUser(parsed);
    }
  }, []);

  // // Fetch donations from backend
  // const fetchDonations = async () => {
  //   try {
  //     const query = new URLSearchParams({
  //       food_variety: filters.foodVariety,
  //       food_category: filters.foodCategory,
  //       min_servings: filters.servings,
  //     }).toString();

  //     const res = await fetch(`http://localhost:5000/api/donations/available?${query}`);
  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.error || "Failed to fetch donations");
  //     setDonations(data);
  //   } catch (err) {
  //     console.error("Error fetching donations:", err);
  //   }
  // };

  // useEffect(() => {
  //   fetchDonations();
  //   const interval = setInterval(fetchDonations, 5000);
  //   return () => clearInterval(interval);
  // }, [filters]);


  // 🧮 Filter helper (moved outside useEffect)
  const filterByDistance = (donations, maxDistance) => {
    return donations.filter((donation) => {
      const distance = donation.distance || 0;
      return distance <= maxDistance;
    });
  };

  useEffect(() => {
    const interval = setInterval(fetchDonations, 3000);
    return () => clearInterval(interval);
  }, [filters, user]);

  const fetchDonations = async () => {
    if (!user) return;

    try {
      const query = new URLSearchParams({
        food_variety: filters.foodVariety || "",
        food_category: filters.foodCategory || "",
        min_servings: filters.servings || 0,
        ngo_lat: user.latitude,
        ngo_lon: user.longitude,
      }).toString();

      // Fetch both available and accepted
      const [availableRes, acceptedRes] = await Promise.all([
        fetch(`http://localhost:5000/api/donations/available?${query}`),
        fetch(`http://localhost:5000/api/donations/accepted?ngo_lat=${user.latitude}&ngo_lon=${user.longitude}`),
      ]);

      const availableData = await availableRes.json();
      const acceptedData = await acceptedRes.json();

      // Sort available donations by distance ascending
      availableData.sort((a, b) => {
        if (a.distance == null) return 1;
        if (b.distance == null) return -1;
        return a.distance - b.distance;
      });

      // ✅ Apply distance filter ONLY to available donations
      const filteredAvailable = availableData.filter(
        (d) => d.distance != null && d.distance <= filters.distance
      );

      // ✅ Merge filtered available + all accepted (kept always)
      const merged = [...filteredAvailable, ...acceptedData];

      setDonations(merged);
    } catch (err) {
      console.error("Error fetching donations:", err);
    }
  };


  // Accept donation
  const handleAccept = async (donationId) => {
    try {
      if (!user?.user_id) return alert("Please log in as an NGO.");
      const res = await fetch(`http://localhost:5000/api/donations/${donationId}/accept`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ngo_id: user.user_id }),
      });
      if (!res.ok) throw new Error("Failed to accept donation");
      alert("Donation accepted!");
      fetchDonations();
    } catch (err) {
      console.error("Error accepting donation:", err);
      alert("Error accepting donation");
    }
  };

  // Apply filters
  const applyFilters = () => {
    fetchDonations().then((data) => {
      if (data) {
        const withinRadius = filterByDistance(data, filters.distance);
        setDonations(withinRadius);
      }
    });
    setIsSidebarOpen(false);
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
