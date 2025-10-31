import React, { useState, useEffect } from 'react';
import '../CSS/RestoDash.css';
import OCR from '../components/OCR';
import RestoDashMap from '../components/RestoDashMap';

function RestoDash() {
  const [formData, setFormData] = useState({
    foodType: 'Cooked',
    foodName: '',
    quantity: '',
    unit: 'Kilograms (kg)',
    expiryTime: '',
    expiryHours: 4,
    description: ''
  });

  const [donations, setDonations] = useState([]);
  const [uploadedImage, setUploadedImage] = useState('');
  const [selectedDonationId, setSelectedDonationId] = useState(null);


  // 🧠 Stats for dashboard
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

  // 🧩 Image upload
  const handleImageClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setUploadedImage(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // 🧩 OCR extracted data (only when packaged)
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

  // 🧠 Fetch all donations on page load
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const restaurantId = 1; // Replace with logged-in restaurant ID
        const response = await fetch(`http://localhost:5000/api/donations?restaurant_id=${restaurantId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to fetch donations");

        const formattedDonations = data.map(donation => ({
          id: donation.donation_id,
          name: donation.food_type,
          quantity: `${donation.quantity} ${donation.unit}`,
          image: 'https://via.placeholder.com/100',
          status: donation.status.charAt(0).toUpperCase() + donation.status.slice(1),
          details: donation.description || "No additional details provided",
          expiry: new Date(donation.expiry_time).toLocaleString(),
        }));

        setDonations(formattedDonations);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations();
  }, []);

  // 🗑️ Delete donation
  const handleDeleteDonation = async (donationId) => {
    if (!window.confirm("Are you sure you want to delete this donation?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/donations/${donationId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error("Failed to delete donation");

      setDonations(donations.filter(donation => donation.id !== donationId));
      alert("Donation deleted successfully!");
    } catch (error) {
      console.error("Error deleting donation:", error);
      alert("Failed to delete donation. Please try again.");
    }
  };

  // 🧾 Handle submit
  const handleSubmit = async () => {
    if (!formData.foodName || !formData.quantity || (!formData.expiryTime && formData.foodType === 'Packaged')) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      let expiryFinal = '';

      if (formData.foodType === 'Packaged') {
        expiryFinal = formData.expiryTime;
      } else {
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + parseInt(formData.expiryHours));
        expiryFinal = expiryDate.toISOString();
      }

      const donationData = {
        restaurant_id: 1,
        food_type: formData.foodName,
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        expiry_time: expiryFinal,
        description: formData.description || '',
        status: 'available'
      };

      const response = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donationData)
      });

      if (!response.ok) throw new Error('Failed to create donation');

      const result = await response.json();

      const newDonation = {
        id: result.donation_id || Date.now(),
        name: formData.foodName,
        quantity: `${formData.quantity} ${formData.unit}`,
        image: uploadedImage,
        status: 'Available',
        details: formData.description || 'No additional details provided',
        expiry: new Date(expiryFinal).toLocaleString()
      };

      setDonations([newDonation, ...donations]);

      setFormData({
        foodType: 'Cooked',
        foodName: '',
        quantity: '',
        unit: 'Kilograms (kg)',
        expiryTime: '',
        expiryHours: 4,
        description: ''
      });

      alert('Donation created successfully!');
    } catch (error) {
      console.error('Error creating donation:', error);
      alert('Failed to create donation. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      foodType: 'Cooked',
      foodName: '',
      quantity: '',
      unit: 'Kilograms (kg)',
      expiryTime: '',
      expiryHours: 4,
      description: ''
    });
  };

  return (
    <div className="resto-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Restaurant Dashboard</h1>
        <p className="welcome-text">Welcome, Tanvi and Sahil </p>
        <p className="welcome-text">Joshya Hadd ikd tujh ky kaam naahiye</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card"><div className="stat-label">Total Donations</div><div className="stat-value total">{stats.total}</div></div>
        <div className="stat-card"><div className="stat-label">Available</div><div className="stat-value available">{stats.available}</div></div>
        <div className="stat-card"><div className="stat-label">Claimed</div><div className="stat-value claimed">{stats.claimed}</div></div>
        <div className="stat-card"><div className="stat-label">Delivered</div><div className="stat-value delivered">{stats.delivered}</div></div>
      </div>

      <div className="main-content">
        {/* Left Sidebar */}
        <div className="form-sidebar">
          <h2>Add Food Donation</h2>
          <p className="form-subtitle">Share surplus food with your community</p>

          <div className="form-group">
            <label>Food Type</label>
            <select name="foodType" value={formData.foodType} onChange={handleChange} className="form-select">
              <option value="Cooked">Cooked Food</option>
              <option value="Packaged">Packaged Food</option>
            </select>
          </div>

          {/* OCR appears only for Packaged food */}
          {formData.foodType === 'Packaged' && (
            <div className="ocr-section">
              <OCR onExtractedData={handleOCRExtractedData} />
            </div>
          )}

          <div className="form-group">
            <label>Food Name <span className="required">*</span></label>
            <input type="text" name="foodName" value={formData.foodName} onChange={handleChange} className="form-input" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantity <span className="required">*</span></label>
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

          {/* Conditional Expiry Field */}
          <div className="form-group">
            {formData.foodType === 'Packaged' ? (
              <>
                <label>Expiry Date <span className="required">*</span></label>
                <input type="date" name="expiryTime" value={formData.expiryTime} onChange={handleChange} className="form-input" />
              </>
            ) : (
              <>
                <label>Expiry Time (Hours) <span className="required">*</span></label>
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

        {/* Right Section: Donation List */}
        <div className="donations-section">
          <h2>Your Donations</h2>

          <div className="donations-list">
            {donations.length === 0 ? (
              <p className="no-donations">No donations yet. Add your first one!</p>
            ) : (
              donations.map(donation => (
                // <div key={donation.id} className="donation-card">
                <div className="donation-card" onClick={() => setSelectedDonationId(donation.id)}>
                  <img src={donation.image || 'https://via.placeholder.com/100'} alt={donation.name} className="donation-image" />
                  <div className="donation-details">
                    <div className="donation-header">
                      <h3>{donation.name}</h3>
                      <span className={`status-badge ${donation.status.toLowerCase()}`}>{donation.status}</span>
                    </div>
                    <p className="donation-quantity">{donation.quantity}</p>
                    <p className="donation-info">{donation.details}</p>
                    <p className="donation-expiry">Expires: {donation.expiry}</p>

                    <button className="delete-button" onClick={() => handleDeleteDonation(donation.id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
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
