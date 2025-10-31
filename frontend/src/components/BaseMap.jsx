import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import io from "socket.io-client";

const BaseMap = ({ donationId, restaurantLocation }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const routingControlRef = useRef(null);
  const socket = useRef(null);
  const volunteerMarkerRef = useRef(null);

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

    // ✅ Add restaurant marker immediately
    if (restaurantLocation) {
      const restoMarker = L.marker(
        [restaurantLocation.lat, restaurantLocation.lng],
        {
          icon: L.icon({
            iconUrl: "/photos/red.png",
            iconSize: [30, 30],
          }),
        }
      ).addTo(leafletMap);
      restoMarker.bindPopup("🍽️ Restaurant Location").openPopup();

      leafletMap.setView(
        [restaurantLocation.lat, restaurantLocation.lng],
        12
      );
    }

    // ✅ Initialize Socket.IO
    socket.current = io("http://localhost:3000"); // <--- use backend port!
    socket.current.emit("join-donation-room", donationId);

    // 🏠 NGO accepts donation
    socket.current.on("donation-accepted", (data) => {
      if (data.donationId === donationId && data.ngoLocation) {
        const ngoMarker = L.marker(
          [data.ngoLocation.lat, data.ngoLocation.lng],
          {
            icon: L.icon({ iconUrl: "/photos/green.png", iconSize: [30, 30] }),
          }
        ).addTo(leafletMap);
        ngoMarker.bindPopup("🏠 NGO Location");
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
  }, [donationId, restaurantLocation]);

  // 🗺️ Draw route between restaurant, NGO, and volunteer
  const drawRoute = (leafletMap, data) => {
    const { restaurant, ngo, volunteer } = data;
    const waypoints = [
      L.latLng(restaurant.lat, restaurant.lng),
      L.latLng(ngo.lat, ngo.lng),
    ];

    if (volunteer) {
      waypoints.unshift(L.latLng(volunteer.lat, volunteer.lng));
    }

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
  };

  return (
    <div
      ref={mapRef}
      style={{ height: "400px", width: "100%", borderRadius: "10px" }}
    />
  );
};

export default BaseMap;
