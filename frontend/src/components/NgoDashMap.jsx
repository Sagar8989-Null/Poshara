import React, { useEffect, useState } from "react";
import BaseMap from "./BaseMap";

const NgoDashMap = ({ donationId }) => {
  const [locations, setLocations] = useState(null);

  useEffect(() => {
    if (!donationId) return;

    const fetchDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/donations/${donationId}/details`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch map data");
        setLocations(data);
      } catch (err) {
        console.error("Error fetching donation details:", err);
        setLocations(null);
      }
    };

    fetchDetails();
  }, [donationId]);

  if (!donationId)
    return <div className="map-placeholder">Select a donation to view its route 🗺️</div>;

  if (!locations)
    return <div className="map-placeholder">No location data available.</div>;

  return <BaseMap role="ngo" donationId={donationId} locations={locations} />;
};

export default NgoDashMap;
