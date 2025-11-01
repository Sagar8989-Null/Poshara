import React, { useState, useEffect } from 'react';
import '../CSS/RestoDash.css';
import { Menu, X } from 'lucide-react';
import OCR from '../components/OCR';
import RestoDashMap from '../components/RestoDashMap';
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // Adjust backend URL if different


/* ---------------------------- Sidebar Component ---------------------------- */
function Sidebar({ formData, handleChange, handleOCRExtractedData, handleSubmit, handleCancel, isOpen, onClose }) {
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
          <h2>Add Food Donation</h2>
          <button onClick={onClose} className="close-btn md:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="filters-container">
          <div className="form-subtitle">Share surplus food with your community</div>

          {/* Food Variety */}
          <div className="filter-card">
            <label>Food Variety</label>
            <select name="foodVariety" value={formData.foodVariety} onChange={handleChange} className="form-select">
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
            </select>
          </div>

          {/* Food Category */}
          <div className="filter-card">
            <label>Food Category</label>
            <select name="foodCategory" value={formData.foodCategory} onChange={handleChange} className="form-select">
              <option value="Cooked">Cooked Food</option>
              <option value="Packaged">Packaged Food</option>
            </select>
          </div>

          {formData.foodCategory === 'Packaged' && (
            <div className="ocr-section">
              <OCR onExtractedData={handleOCRExtractedData} />
            </div>
          )}

          <div className="filter-card">
            <label>Food Name *</label>
            <input type="text" name="foodName" value={formData.foodName} onChange={handleChange} className="form-input" />
          </div>

          <div className="filter-card">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label>Quantity *</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="form-input" />
              </div>
              <div>
                <label>Unit</label>
                <select name="unit" value={formData.unit} onChange={handleChange} className="form-select">
                  <option>Kilograms (kg)</option>
                  <option>Grams (g)</option>
                  <option>Liters (L)</option>
                  <option>Pieces</option>
                  <option>Plates</option>
                </select>
              </div>
            </div>
          </div>

          {/* Expiry */}
          <div className="filter-card">
            {formData.foodCategory === 'Packaged' ? (
              <>
                <label>Expiry Date *</label>
                <input type="date" name="expiryTime" value={formData.expiryTime} onChange={handleChange} className="form-input" />
              </>
            ) : (
              <>
                <label>Expiry Time (Hours)</label>
                <input type="number" name="expiryHours" value={formData.expiryHours} onChange={handleChange} className="form-input" min="1" max="48" />
                <p className="hint">Default is 4 hours.</p>
              </>
            )}
          </div>

          <div className="filter-card">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="form-textarea" />
          </div>

          <div className="apply-btn-container">
            <button className="apply-btn" onClick={handleSubmit}>Create Donation</button>
            <button className="cancel-button" onClick={handleCancel} style={{ marginTop: '0.5rem', width: '100%' }}>Cancel</button>
          </div>
        </div>
      </aside>
    </>
  );
}

/* --------------------------- Donation Item Card --------------------------- */
function DonationItem({ donation, onDelete, onSelect }) {
  return (
    <div className="donation-item">
      <div>
        <h3>{donation.name}</h3>
        <p>Quantity: {donation.quantity}</p>
        <p>{donation.details}</p>
        <p>Expires: {donation.expiry}</p>
      </div>

      <div className="donation-actions">
        <span className={`status ${donation.status.toLowerCase()}`}>{donation.status}</span>
        <button
          className="map-btn"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(donation.id);
          }}
        >
          View on Map
        </button>
        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(donation.id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- Main Section ------------------------------ */
function MainContent({ donations, onMenuClick, onDelete, user, selectedDonationId, onSelectDonation }) {
  return (
    <main className="main-content">
      <div className="header">
        <Menu className="menu-icon md:hidden" onClick={onMenuClick} />
        <h2>Restaurant Dashboard</h2>
      </div>

      {user && (
        <div className="user-profile-section">
          <p className="welcome-text">Welcome, {user.name}!</p>
          <div className="user-details">
            <p><strong>Role:</strong> {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}</p>
            <p><strong>User ID:</strong> {user.user_id}</p>
          </div>
        </div>
      )}

      <h3 className="section-title">Your Donations</h3>

      <section className="donations-section">
        <div className="donations-list">
          {donations.length > 0 ? (
            donations.map((donation) => (
              <DonationItem
                key={donation.id}
                donation={donation}
                onDelete={onDelete}
                onSelect={onSelectDonation}
              />
            ))
          ) : (
            <p className="empty-text">No donations yet. Add your first one!</p>
          )}
        </div>
      </section>

      <section className="map-section">
        <h3>Map View</h3>
        {selectedDonationId ? (
          <RestoDashMap donationId={selectedDonationId} />
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
function RestoDash() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    foodName: "",
    foodVariety: "Veg",
    foodCategory: "Cooked",
    quantity: "",
    unit: "Kilograms (kg)",
    expiryTime: "",
    expiryHours: 4,
    description: ""
  });

  const [donations, setDonations] = useState([]);
  const [uploadedImage, setUploadedImage] = useState('');
  const [selectedDonationId, setSelectedDonationId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

 // ✅ Listen for live volunteer updates based on the selected donation
useEffect(() => {
  if (!selectedDonationId) return; // Only join when a donation is selected

  socket.emit("join-donation-room", selectedDonationId);

  socket.on("volunteer-location", (data) => {
    // Broadcast this update globally for map to handle
    window.dispatchEvent(new CustomEvent("volunteer-location-update", { detail: data }));
  });

  return () => {
    socket.off("volunteer-location");
  };
}, [selectedDonationId]);

useEffect(() => {
  const handleVolunteerUpdate = (e) => {
    const { latitude, longitude } = e.detail;
    setVolunteerMarker({ lat: latitude, lng: longitude });
  };

  window.addEventListener("volunteer-location-update", handleVolunteerUpdate);
  return () => window.removeEventListener("volunteer-location-update", handleVolunteerUpdate);
}, []);


  // Load user info
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // OCR extracted data
  const handleOCRExtractedData = (ocrData) => {
    setFormData(prev => ({
      ...prev,
      foodName: ocrData.food_name || prev.foodName,
      quantity: ocrData.quantity || prev.quantity,
      unit: ocrData.unit || prev.unit,
      expiryTime: ocrData.expiry || prev.expiryTime,
      description: ocrData.description || prev.description
    }));
  };

  // Fetch donations for logged-in restaurant
  const fetchDonations = async () => {
    try {
      const userData = localStorage.getItem("user");
      const parsedUser = userData ? JSON.parse(userData) : null;
      const restaurantId = parsedUser?.user_id || 1;

      const response = await fetch(`http://localhost:5000/api/donations?restaurant_id=${restaurantId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch donations");

      const formatted = data.map(d => ({
        id: d.donation_id,
        name: d.food_name,
        quantity: `${d.quantity} ${d.unit}`,
        image: 'https://via.placeholder.com/100',
        status: d.status.charAt(0).toUpperCase() + d.status.slice(1),
        details: d.description || "No additional details",
        expiry: new Date(d.expiry_time).toLocaleString(),
      }));
      setDonations(formatted);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // Delete donation
  const handleDeleteDonation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donation?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/donations/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("Failed to delete donation");
      setDonations(donations.filter(d => d.id !== id));
      alert("Donation deleted successfully!");
    } catch (error) {
      console.error("Error deleting donation:", error);
      alert("Failed to delete donation.");
    }
  };

  // Create donation
  const handleSubmit = async () => {
    if (!formData.foodName || !formData.quantity || (!formData.expiryTime && formData.foodCategory === 'Packaged')) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      let expiryFinal = '';
      if (formData.foodCategory === 'Packaged') {
        expiryFinal = formData.expiryTime;
      } else {
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + parseInt(formData.expiryHours));
        expiryFinal = expiryDate.toISOString();
      }

      const userData = localStorage.getItem("user");
      const parsedUser = userData ? JSON.parse(userData) : null;

      const donationData = {
        restaurant_id: parsedUser?.user_id || 1,
        food_name: formData.foodName,
        food_variety: formData.foodVariety,
        food_category: formData.foodCategory,
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        expiry_time: expiryFinal,
        description: formData.description || '',
        status: 'available'
      };

      const res = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donationData)
      });

      if (!res.ok) throw new Error('Failed to create donation');
      const result = await res.json();

      const newDonation = {
        id: result.donation_id || Date.now(),
        name: formData.foodName,
        quantity: `${formData.quantity} ${formData.unit}`,
        image: uploadedImage || 'https://via.placeholder.com/100',
        status: 'Available',
        details: formData.description || 'No additional details',
        expiry: new Date(expiryFinal).toLocaleString()
      };

      setDonations([newDonation, ...donations]);
      setFormData({
        foodName: "",
        foodVariety: "Veg",
        foodCategory: "Cooked",
        quantity: "",
        unit: "Kilograms (kg)",
        expiryTime: "",
        expiryHours: 4,
        description: ""
      });
      setIsSidebarOpen(false);
      alert('Donation created successfully!');
      fetchDonations();
    } catch (error) {
      console.error('Error creating donation:', error);
      alert('Failed to create donation.');
    }
  };

  const handleCancel = () => {
    setFormData({
      foodName: "",
      foodVariety: "Veg",
      foodCategory: "Cooked",
      quantity: "",
      unit: "Kilograms (kg)",
      expiryTime: "",
      expiryHours: 4,
      description: ""
    });
    setIsSidebarOpen(false);
  };

  return (
    <div className="resto-container">
      <div className="content-wrapper">
        <Sidebar
          formData={formData}
          handleChange={handleChange}
          handleOCRExtractedData={handleOCRExtractedData}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <MainContent
          donations={donations}
          onMenuClick={() => setIsSidebarOpen(true)}
          onDelete={handleDeleteDonation}
          user={user}
          selectedDonationId={selectedDonationId}
          onSelectDonation={setSelectedDonationId}
        />
      </div>
      <Footer />
    </div>
  );
}

export default RestoDash;
