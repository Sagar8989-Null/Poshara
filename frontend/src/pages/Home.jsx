import React from "react";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>Welcome to Poshara</h1>
        <p>Connecting Restaurants, NGOs, and Volunteers to turn surplus food into smiles 🍛</p>
        <div className="cta-buttons">
          <button>Join as Restaurant</button>
          <button>Join as NGO</button>
          <button>Join as Volunteer</button>
        </div>
      </section>

      <section className="stats">
        <div className="stat-card">
          <h2>1200 kg</h2>
          <p>Food Saved</p>
        </div>
        <div className="stat-card">
          <h2>30+</h2>
          <p>NGOs Connected</p>
        </div>
        <div className="stat-card">
          <h2>50+</h2>
          <p>Restaurants Partnered</p>
        </div>
      </section>
    </div>
  );
}

export default Home;