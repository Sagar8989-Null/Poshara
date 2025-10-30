import React from "react";
import "../CSS/slider.css";

const Slider = () => {
  return (
    <main className="slider-container">
      {/* Top slider (normal direction) */}
      <div
        className="slider"
        style={{
          "--width": "200px",
          "--height": "60px",
          "--quantity": 10,
        }}
      >
        <div className="list">
          <div className="item" style={{ "--position": 1 }}>Reduce Food Waste</div>
          <div className="item" style={{ "--position": 2 }}>Join as Volunteer</div>
          <div className="item" style={{ "--position": 3 }}>Feed the Hungry</div>
          <div className="item" style={{ "--position": 4 }}>Support Local NGOs</div>
          <div className="item" style={{ "--position": 5 }}>Every Meal Counts</div>
          <div className="item" style={{ "--position": 6 }}>Save Surplus Food</div>
          <div className="item" style={{ "--position": 7 }}>Help Communities</div>
          <div className="item" style={{ "--position": 8 }}>Be the Change</div>
          <div className="item" style={{ "--position": 9 }}>Share to Care</div>
          <div className="item" style={{ "--position": 10 }}>Act Now</div>
        </div>
      </div>

      {/* Bottom slider (reverse direction) */}
      <div
        className="slider"
        reverse="true"
        style={{
          "--width": "250px",
          "--height": "60px",
          "--quantity": 8,
        }}
      >
        <div className="list">
          <div className="item" style={{ "--position": 1 }}>Restaurants Partnered</div>
          <div className="item" style={{ "--position": 2 }}>NGOs Connected</div>
          <div className="item" style={{ "--position": 3 }}>Meals Delivered</div>
          <div className="item" style={{ "--position": 4 }}>Helping Hands</div>
          <div className="item" style={{ "--position": 5 }}>Together We Can</div>
          <div className="item" style={{ "--position": 6 }}>Spread Kindness</div>
          <div className="item" style={{ "--position": 7 }}>Donate Food</div>
          <div className="item" style={{ "--position": 8 }}>Make a Difference</div>
        </div>
      </div>
    </main>
  );
};

export default Slider;

