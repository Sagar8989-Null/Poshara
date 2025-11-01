import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import io from "socket.io-client";

const BaseMap = ({ donationId, role }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const routingControlRef = useRef(null);
  const socket = useRef(null);

  const volunteerMarkerRef = useRef(null);
  const restaurantMarkerRef = useRef(null);
  const ngoMarkerRef = useRef(null);

  const [donationDetails, setDonationDetails] = useState(null);
  const [volunteerLocation, setVolunteerLocation] = useState(null);

  // 🧭 Helper: Clear previous markers and route
  const clearMapData = () => {
    if (routingControlRef.current) {
      routingControlRef.current.remove();
      routingControlRef.current = null;
    }

    // [volunteerMarkerRef, restaurantMarkerRef, ngoMarkerRef].forEach((ref) => {
    [restaurantMarkerRef, ngoMarkerRef].forEach((ref) => {
      if (ref.current) {
        ref.current.remove();
        ref.current = null;
      }
    });
  };

  // 🗺️ Initialize the map once
  useEffect(() => {
    if (map) return;

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });

    const leafletMap = L.map(mapRef.current).setView([20.59, 78.96], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; AnnaPurna Network",
    }).addTo(leafletMap);

    setMap(leafletMap);

    // Initialize socket connection only once
    socket.current = io("http://localhost:3000");

    return () => {
      leafletMap.remove();
      socket.current?.disconnect();
    };
  }, []);

  // 🧾 Fetch donation details whenever donationId changes
  useEffect(() => {
    if (!donationId) return;

    const fetchDonationDetails = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/donations/${donationId}/details`
        );
        const data = await res.json();
        if (res.ok) setDonationDetails(data);
      } catch (err) {
        console.error("Error fetching donation details:", err);
      }
    };

    fetchDonationDetails();
  }, [donationId]);

  // 🧭 Update map markers whenever donation details change
  useEffect(() => {
    if (!map || !donationDetails) return;

    // Clear previous markers + route
    clearMapData();
    
    const { restaurant, ngo } = donationDetails;
    const waypoints = [];
    
    // 🍽️ Restaurant marker
    if (restaurant) {
      restaurantMarkerRef.current = L.marker(
        [restaurant.lat, restaurant.lng],
        {
          icon: L.icon({
            iconUrl: "/photos/red.png",
            iconSize: [30, 30],
          }),
        }
      )
        .addTo(map)
        .bindPopup(`🍽️ ${restaurant.name || "Restaurant"}`)
        .openPopup();

      map.setView([restaurant.lat, restaurant.lng], 12);
    }

    // 🏠 NGO marker
    if (ngo) {
      ngoMarkerRef.current = L.marker([ngo.lat, ngo.lng], {
        icon: L.icon({
          iconUrl: "/photos/green.png",
          iconSize: [30, 30],
        }),
      })
        .addTo(map)
        .bindPopup(`🏠 ${ngo.name || "NGO"}`);
    }

    // 🔵 Draw route between restaurant and NGO
    if (role === "volunteer") {
    if (volunteerLocation) {
      waypoints.push(L.latLng(volunteerLocation.lat, volunteerLocation.lng));
    }
  }
    if (restaurant) waypoints.push(L.latLng(restaurant.lat, restaurant.lng));
    if (ngo) waypoints.push(L.latLng(ngo.lat, ngo.lng));

    if (waypoints.length >= 2) {
      routingControlRef.current = L.Routing.control({
        waypoints,
        routeWhileDragging: false,
        addWaypoints: false,
        createMarker: () => null,
        lineOptions: { styles: [{ color: "blue", weight: 5 }] },
      }).addTo(map);
    }
  }, [donationDetails, map, role, volunteerLocation]);

  // 🚗 Handle volunteer tracking (only for volunteer role)
  useEffect(() => {
    // if (!map || role !== "volunteer" || !donationId) return;
    if (!map || role !== "volunteer" || !donationId || !donationDetails) return;

    const updateVolunteerLocation = (lat, lng) => {

      setVolunteerLocation({lat,lng});

      if (!volunteerMarkerRef.current) {
        volunteerMarkerRef.current = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: "/photos/tracker.png",
            iconSize: [30, 30],
          }),
        })
          .addTo(map)
          .bindPopup("🚴 Volunteer Location (You)");
        
        map.flyTo([lat][lng],13)
      } else {
        volunteerMarkerRef.current.setLatLng([lat, lng]);
      }

      if (socket.current) {
        socket.current.emit("volunteer-location", { donationId, lat, lng });
      }
    };

    // Initial position
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        updateVolunteerLocation(latitude, longitude);
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true }
    );

    // Continuous updates
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        updateVolunteerLocation(latitude, longitude);
      },
      (err) => console.error("Geolocation watch error:", err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map, role, donationId,donationDetails]);

  return (
    <div
      ref={mapRef}
      style={{ height: "400px", width: "100%", borderRadius: "10px" }}
    />
  );
};

export default BaseMap;
