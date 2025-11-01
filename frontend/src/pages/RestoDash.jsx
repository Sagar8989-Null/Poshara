import React, { useState, useEffect } from 'react';
import '../CSS/RestoDash.css';
import OCR from '../components/OCR';
import RestoDashMap from '../components/RestoDashMap';

function RestoDash() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    foodName: "",
    foodVariety: "Veg",      // 🆕 Veg / Non-Veg
    foodCategory: "Cooked",  // 🆕 Cooked / Packaged
    quantity: "",
    unit: "Kilograms (kg)",
    expiryTime: "",
    expiryHours: 4,
    description: ""
  });

  const [donations, setDonations] = useState([]);
  const [uploadedImage, setUploadedImage] = useState('');
  const [selectedDonationId, setSelectedDonationId] = useState(null);

  // 🧠 Load user data
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  // 🧮 Dashboard stats
  const stats = {
    total: donations.length,
    available: donations.filter(d => d.status === 'Available').length,
    claimed: donations.filter(d => d.status === 'Claimed').length,
    delivered: donations.filter(d => d.status === 'Delivered').length
  };

  // 🧩 Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🧩 OCR extracted data
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

  // 🧠 Fetch donations for logged-in restaurant
  useEffect(() => {
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
    fetchDonations();
  }, []);

  // 🗑 Delete donation
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

  // ✅ Create donation
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

      alert('Donation created successfully!');
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
  };

  return (
    <div className="resto-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Restaurant Dashboard</h1>
        {user && (
          <div className="user-profile-section">
            <p className="welcome-text">Welcome, {user.name}!</p>
            <div className="user-details">
              <p><strong>Role:</strong> {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}</p>
              <p><strong>User ID:</strong> {user.user_id}</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="stats-container">
        <div className="stat-card"><div className="stat-label">Total Donations</div><div className="stat-value total">{stats.total}</div></div>
        <div className="stat-card"><div className="stat-label">Available</div><div className="stat-value available">{stats.available}</div></div>
        <div className="stat-card"><div className="stat-label">Claimed</div><div className="stat-value claimed">{stats.claimed}</div></div>
        <div className="stat-card"><div className="stat-label">Delivered</div><div className="stat-value delivered">{stats.delivered}</div></div>
      </div>

      <div className="main-content">
        {/* Form */}
        <div className="form-sidebar">
          <h2>Add Food Donation</h2>
          <p className="form-subtitle">Share surplus food with your community</p>

          {/* Food Variety */}
          <div className="form-group">
            <label>Food Variety</label>
            <select name="foodVariety" value={formData.foodVariety} onChange={handleChange} className="form-select">
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
            </select>
          </div>

          {/* Food Category */}
          <div className="form-group">
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

          <div className="form-group">
            <label>Food Name *</label>
            <input type="text" name="foodName" value={formData.foodName} onChange={handleChange} className="form-input" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantity *</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
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

          {/* Expiry */}
          <div className="form-group">
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

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="form-textarea" />
          </div>

          <div className="form-actions">
            <button className="submit-button" onClick={handleSubmit}>Create Donation</button>
            <button className="cancel-button" onClick={handleCancel}>Cancel</button>
          </div>
        </div>

        {/* Donations List */}
        <div className="donations-section">
          <h2>Your Donations</h2>
          <div className="donations-list">
            {donations.length === 0 ? (
              <p className="no-donations">No donations yet. Add your first one!</p>
            ) : (
              donations.map(d => (
                <div key={d.id} className="donation-card" onClick={() => setSelectedDonationId(d.id)}>
                  <img src={d.image} alt={d.name} className="donation-image" />
                  <div className="donation-details">
                    <div className="donation-header">
                      <h3>{d.name}</h3>
                      <span className={`status-badge ${d.status.toLowerCase()}`}>{d.status}</span>
                    </div>
                    <p className="donation-quantity">{d.quantity}</p>
                    <p className="donation-info">{d.details}</p>
                    <p className="donation-expiry">Expires: {d.expiry}</p>
                    <button className="delete-button" onClick={() => handleDeleteDonation(d.id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Map Section */}
        {selectedDonationId && (
          <div className="map-section">
            <h3>Map for Donation #{selectedDonationId}</h3>
            <RestoDashMap donationId={selectedDonationId} />
          </div>
        )}
      </div>
    </div>
  );
}

export default RestoDash;
