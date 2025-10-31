import React, { useState, useEffect } from 'react';
import '../CSS/NgoDash.css';
import { Menu, Ruler, Leaf, Box, Users, X } from 'lucide-react';

// --- Mock Data for Donations ---
const allDonations = [
  { id: 1, name: 'Sujata Hotel', status: 'Accepted', distance: 5, type: 'Veg', packaging: 'Packaged', servings: 50 },
  { id: 2, name: 'Durga Hotel', status: 'Waiting', distance: 10, type: 'Non-Veg', packaging: 'Packaged', servings: 20 },
  { id: 3, name: 'Modern Cafe', status: 'Waiting', distance: 3, type: 'Veg', packaging: 'Unpackaged', servings: 15 },
  { id: 4, name: 'Green Leaf', status: 'Accepted', distance: 45, type: 'Veg', packaging: 'Packaged', servings: 100 },
  { id: 5, name: 'BBQ Nation', status: 'Waiting', distance: 22, type: 'Non-Veg', packaging: 'Unpackaged', servings: 75 },
  { id: 6, name: 'Anna Idli', status: 'Waiting', distance: 8, type: 'Veg', packaging: 'Unpackaged', servings: 30 },
];

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

  // Close sidebar on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent scroll when sidebar open (for mobile)
  useEffect(() => {
    if (isOpen) document.body.classList.add('sidebar-open');
    else document.body.classList.remove('sidebar-open');
  }, [isOpen]);

  return (
    <>
      {/* Overlay for mobile only */}
      {isOpen && <div className="overlay md:hidden" onClick={onClose}></div>}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Filters</h2>
          {/* Mobile close button */}
          <button onClick={onClose} className="close-btn md:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="filters-container">
          {/* Distance Filter */}
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

          {/* Food Type Filter */}
          <div className="filter-card">
            <span className="filter-title">
              <Leaf className="icon green" />
              Food Type
            </span>
            <div className="toggle-group">
              <button
                onClick={() => handleButtonToggle('foodType', 'Veg')}
                className={`toggle-btn ${foodType === 'Veg' ? 'active' : ''}`}
              >
                Veg
              </button>
              <button
                onClick={() => handleButtonToggle('foodType', 'Non-Veg')}
                className={`toggle-btn ${foodType === 'Non-Veg' ? 'active' : ''}`}
              >
                Non-Veg
              </button>
            </div>
          </div>

          {/* Packaging Filter */}
          <div className="filter-card">
            <span className="filter-title">
              <Box className="icon blue" />
              Packaging
            </span>
            <div className="toggle-group">
              <button
                onClick={() => handleButtonToggle('packaging', 'Unpackaged')}
                className={`toggle-btn ${packaging === 'Unpackaged' ? 'active' : ''}`}
              >
                Unpackaged
              </button>
              <button
                onClick={() => handleButtonToggle('packaging', 'Packaged')}
                className={`toggle-btn ${packaging === 'Packaged' ? 'active' : ''}`}
              >
                Packaged
              </button>
            </div>
          </div>

          {/* Servings Filter */}
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

          {/* Apply Filters Button - moved just below Minimum Servings */}
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
function DonationItem({ donation }) {
  const { name, status, distance } = donation;
  const statusClass = status === 'Accepted' ? 'accepted' : 'waiting';

  return (
    <div className="donation-item">
      <div>
        <h3>{name}</h3>
        <p>{distance} km away</p>
      </div>
      <span className={`status ${statusClass}`}>{status}</span>
    </div>
  );
}

// --- Main Content ---
function MainContent({ donations, onMenuClick }) {
  return (
    <main className="main-content">
      <div className="header">
        <Menu className="menu-icon md:hidden" onClick={onMenuClick} />
        <h2 id="ngo-dash">NGO Dashboard</h2>
      </div>

      {/* Requested Donations placed right below Dashboard */}
      <h3 className="section-title">Requested Donations</h3>

      <section className="donations-section">
        <div className="donations-list">
          {donations.length > 0 ? (
            donations.map((donation) => (
              <DonationItem key={donation.id} donation={donation} />
            ))
          ) : (
            <p className="empty-text">No donations match your filters.</p>
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
    foodType: 'Veg',
    packaging: 'Unpackaged',
    servings: 10,
  });

  const [filteredDonations, setFilteredDonations] = useState(allDonations);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const applyFilters = () => {
    const newFilteredList = allDonations.filter((donation) => {
      return (
        donation.distance <= filters.distance &&
        donation.type === filters.foodType &&
        donation.packaging === filters.packaging &&
        donation.servings >= filters.servings
      );
    });
    setFilteredDonations(newFilteredList);
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
          donations={filteredDonations}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
      </div>
      <Footer />
    </div>
  );
}
