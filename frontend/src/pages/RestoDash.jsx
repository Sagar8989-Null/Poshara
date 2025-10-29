import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const RestoDash = () => {
  const [position, setPosition] = useState([19.076, 72.8777]); // fallback: Mumbai

  useEffect(() => {
    const lat = parseFloat(localStorage.getItem("latitude"));
    const lng = parseFloat(localStorage.getItem("longitude"));
    if (lat && lng) setPosition([lat, lng]);
  }, []);

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center py-10">
      <h2 className="text-3xl font-semibold text-pink-700 mb-6">
        🍽️ Restaurant Dashboard
      </h2>
      <p className="text-gray-600 mb-4">
        Welcome back, Restaurant! Your current location is marked below.
      </p>

      <div className="w-11/12 md:w-3/4 h-[400px] rounded-2xl shadow-lg overflow-hidden border border-pink-200">
        <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Marker position={position}>
            <Popup>Restaurant Location</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default RestoDash;

