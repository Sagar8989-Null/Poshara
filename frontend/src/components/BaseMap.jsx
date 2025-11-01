import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import io from "socket.io-client";

const BaseMap = ({ donationId, restaurantLocation, ngoLocation, role }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const routingControlRef = useRef(null);
  const socket = useRef(null);
  const volunteerMarkerRef = useRef(null);
  const restaurantMarkerRef = useRef(null);
  const ngoMarkerRef = useRef(null);
  const [donationDetails, setDonationDetails] = useState(null);

  // 🗺️ Update route when markers are available
  const updateRoute = (leafletMap) => {
    const waypoints = [];

    // Get volunteer location (current position or marker)
    if (volunteerMarkerRef.current) {
      const volunteerPos = volunteerMarkerRef.current.getLatLng();
      waypoints.push(L.latLng(volunteerPos.lat, volunteerPos.lng));
    }

    // Get restaurant location
    if (restaurantMarkerRef.current) {
      const restaurantPos = restaurantMarkerRef.current.getLatLng();
      waypoints.push(L.latLng(restaurantPos.lat, restaurantPos.lng));
    }

    // Get NGO location
    if (ngoMarkerRef.current) {
      const ngoPos = ngoMarkerRef.current.getLatLng();
      waypoints.push(L.latLng(ngoPos.lat, ngoPos.lng));
    }

    // Draw route if we have at least 2 waypoints
    if (waypoints.length >= 2) {
      if (routingControlRef.current) {
        routingControlRef.current.setWaypoints(waypoints);
      } else {
        routingControlRef.current = L.Routing.control({
          waypoints,
          routeWhileDragging: false,
          addWaypoints: false,
          createMarker: () => null,
          lineOptions: { styles: [{ color: "blue", weight: 5 }] },
        }).addTo(leafletMap);
      }
    }
  };

  // 🗺️ Draw route between restaurant, NGO, and volunteer (legacy support)
  const drawRoute = (leafletMap, data) => {
    const { restaurant, ngo, volunteer } = data;
    const waypoints = [];

    if (volunteer) {
      waypoints.push(L.latLng(volunteer.lat, volunteer.lng));
    }
    
    if (restaurant) {
      waypoints.push(L.latLng(restaurant.lat, restaurant.lng));
    }
    
    if (ngo) {
      waypoints.push(L.latLng(ngo.lat, ngo.lng));
    }

    if (waypoints.length >= 2) {
      if (routingControlRef.current) {
        routingControlRef.current.setWaypoints(waypoints);
      } else {
        routingControlRef.current = L.Routing.control({
          waypoints,
          routeWhileDragging: false,
          addWaypoints: false,
          createMarker: () => null,
          lineOptions: { styles: [{ color: "blue", weight: 5 }] },
        }).addTo(leafletMap);
      }
    }
  };

  // Fetch donation details with locations
  useEffect(() => {
    if (!donationId) return;

    const fetchDonationDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/donations/${donationId}/details`);
        const data = await response.json();
        if (response.ok) {
          setDonationDetails(data);
        }
      } catch (error) {
        console.error("Error fetching donation details:", error);
      }
    };

    fetchDonationDetails();
  }, [donationId]);

  useEffect(() => {
    if (map) return;

    // Set default icons
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });

    // Initialize map
    const leafletMap = L.map(mapRef.current).setView([20.59, 78.96], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; AnnaPurna Network",
    }).addTo(leafletMap);
    setMap(leafletMap);

    // ✅ Initialize Socket.IO
    socket.current = io("http://localhost:3000");
    if (donationId) {
      socket.current.emit("join-donation-room", donationId);
    }

    // 🏠 NGO accepts donation
    socket.current.on("donation-accepted", (data) => {
      if (data.donationId === donationId && data.ngoLocation) {
        if (!ngoMarkerRef.current) {
          ngoMarkerRef.current = L.marker(
            [data.ngoLocation.lat, data.ngoLocation.lng],
            {
              icon: L.icon({ iconUrl: "/photos/green.png", iconSize: [30, 30] }),
            }
          ).addTo(leafletMap);
          ngoMarkerRef.current.bindPopup("🏠 NGO Location").openPopup();
          updateRoute(leafletMap);
        }
      }
    });

    // 🚗 Volunteer assigned
    socket.current.on("volunteer-assigned", (data) => {
      if (data.donationId === donationId) {
        drawRoute(leafletMap, data);
      }
    });

    // 🚗 Volunteer live tracking
    socket.current.on("volunteer-location", (data) => {
      if (data.donationId !== donationId) return;
      if (!volunteerMarkerRef.current) {
        volunteerMarkerRef.current = L.marker([data.lat, data.lng], {
          icon: L.icon({
            iconUrl: "/photos/tracker.png",
            iconSize: [30, 30],
          }),
        }).addTo(leafletMap);
        volunteerMarkerRef.current.bindPopup("🚴 Volunteer Location");
        updateRoute(leafletMap);
      } else {
        volunteerMarkerRef.current.setLatLng([data.lat, data.lng]);
      }
    });

    // Cleanup on unmount
    return () => {
      if (routingControlRef.current) routingControlRef.current.remove();
      socket.current?.disconnect();
      leafletMap.remove();
    };
  }, [donationId]);

  // Add markers when data is available
  useEffect(() => {
    if (!map || !donationDetails) return;

    // Add restaurant marker
    if (donationDetails.restaurant && !restaurantMarkerRef.current) {
      restaurantMarkerRef.current = L.marker(
        [donationDetails.restaurant.lat, donationDetails.restaurant.lng],
        {
          icon: L.icon({
            iconUrl: "/photos/red.png",
            iconSize: [30, 30],
          }),
        }
      ).addTo(map);
      restaurantMarkerRef.current.bindPopup(`🍽️ ${donationDetails.restaurant.name || 'Restaurant'}`).openPopup();
      
      // Center map on restaurant
      map.setView(
        [donationDetails.restaurant.lat, donationDetails.restaurant.lng],
        12
      );
    }

    // Add NGO marker if available
    if (donationDetails.ngo && !ngoMarkerRef.current) {
      ngoMarkerRef.current = L.marker(
        [donationDetails.ngo.lat, donationDetails.ngo.lng],
        {
          icon: L.icon({ iconUrl: "/photos/green.png", iconSize: [30, 30] }),
        }
      ).addTo(map);
      ngoMarkerRef.current.bindPopup(`🏠 ${donationDetails.ngo.name || 'NGO'}`);
      
      // Update route if both markers exist
      updateRoute(map);
    }

    // If volunteer role, start tracking volunteer location
    if (role === "volunteer" && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (socket.current && donationId) {
            socket.current.emit("volunteer-location", {
              donationId,
              lat: latitude,
              lng: longitude,
            });
          }
        },
        (error) => console.error("Geolocation error:", error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [map, donationDetails, role, donationId]);

  return (
    <div
      ref={mapRef}
      style={{ height: "400px", width: "100%", borderRadius: "10px" }}
    />
  );
};

export default BaseMap;
