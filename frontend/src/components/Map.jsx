   import React, { useEffect, useRef, useState } from 'react';
   import L from 'leaflet';
   import 'leaflet/dist/leaflet.css';
   import 'leaflet-routing-machine';
   import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
   import io from 'socket.io-client';
   import '../CSS/Map.css'; 

   const AnnaPurnaMap = () => {
     const mapRef = useRef(null);
     const [map, setMap] = useState(null);
     const [appData, setAppData] = useState(null);
     const [hotelCount, setHotelCount] = useState(0);
     const [ngoCount, setNgoCount] = useState(0);
     const [userCount, setUserCount] = useState(0);
     const [latestLatitude, setLatestLatitude] = useState(null);
     const [latestLongitude, setLatestLongitude] = useState(null);
     const [routingControl, setRoutingControl] = useState(null);
     const [hotelMarkers, setHotelMarkers] = useState({});
     const [ngoMarkers, setNgoMarkers] = useState({});
     const [userMarkers, setUserMarkers] = useState({});
     const socket = useRef(null);

     // Fix: Set up default Leaflet icons to prevent broken fallbacks
     useEffect(() => {
       delete L.Icon.Default.prototype._getIconUrl;
       L.Icon.Default.mergeOptions({
         iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
         iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
         shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
       });
     }, []);

     const iconOptions = {
       Hotels: {
         iconUrl: '/photos/red.png', // Ensure this is in frontend/public/photos/
         iconSize: [30, 30]
       },
       NGOS: {
         iconUrl: '/photos/green.png',
         iconSize: [30, 30]
       },
       USER: {
         iconUrl: '/photos/tracker.png',
         iconSize: [30, 30]
       }
     };

     useEffect(() => {
       // Initialize map
       const leafletMap = L.map(mapRef.current).setView([20.593683, 78.962883], 5);
       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "AnnaPurna" }).addTo(leafletMap);
       setMap(leafletMap);

       // Initialize socket
       socket.current = io('http://localhost:3000'); // Explicitly connect to server port

       // Fetch data from server
       fetch('http://localhost:3000/data')
         .then(response => response.json())
         .then(data => {
           setAppData(data);
           setHotelCount(data.hotels ? data.hotels.length : 0);
           setNgoCount(data.ngos ? data.ngos.length : 0);
           // Initialize markers only after map and data are ready
           if (leafletMap) {
             initializeMarkers(data, leafletMap);
           }
         })
         .catch(error => console.error('Error loading data:', error));

       // Geolocation
       if (navigator.geolocation) {
         navigator.geolocation.watchPosition(
           (position) => {
             const { latitude, longitude } = position.coords;
             socket.current.emit("send-location", { latitude, longitude });
           },
           (error) => console.error(error),
           { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
         );
       }

       // Socket listeners
       socket.current.on("recieve-location", (data) => {
         const { id, latitude, longitude } = data;
         setLatestLatitude(latitude);
         setLatestLongitude(longitude);
         leafletMap.setView([latitude, longitude], 15);

         setUserMarkers(prev => {
           if (prev[id]) {
             prev[id].setLatLng([latitude, longitude]);
             return prev;
           } else {
             const marker = L.marker([latitude, longitude], {
               icon: L.icon(iconOptions.USER)
             }).addTo(leafletMap).bindPopup(` User ID - ${id}`);
             return { ...prev, [id]: marker };
           }
         });

         setUserCount(prev => prev + 1);
       });

       socket.current.on("user-disconnected", (id) => {
         setUserMarkers(prev => {
           if (prev[id]) {
             leafletMap.removeLayer(prev[id]);
             const newMarkers = { ...prev };
             delete newMarkers[id];
             return newMarkers;
           }
           return prev;
         });
         setUserCount(prev => Math.max(0, prev - 1));
       });

       // Cleanup
       return () => {
         if (leafletMap) {
           leafletMap.remove();
         }
         if (socket.current) {
           socket.current.disconnect();
         }
       };
     }, []);

     useEffect(() => {
       if (map && appData && latestLatitude !== null && latestLongitude !== null) {
         updateRoute(appData, latestLatitude, latestLongitude, map);
       }
     }, [map, appData, latestLatitude, latestLongitude]);

     const initializeMarkers = (data, leafletMap) => {
       // Add Hotel markers (only first one as per original)
       if (data.hotels && data.hotels.length > 0) {
         const hotel = data.hotels[0];
         const marker = L.marker([hotel.latitude, hotel.longitude], {
           icon: L.icon(iconOptions.Hotels)
         }).addTo(leafletMap).bindPopup(`🏨 Hotel: ${hotel.name}`);
         setHotelMarkers({ [`hotel-${hotel.id}`]: marker });
       }

       // Add NGO markers (only first one as per original)
       if (data.ngos && data.ngos.length > 0) {
         const ngo = data.ngos[0];
         const marker = L.marker([ngo.latitude, ngo.longitude], {
           icon: L.icon(iconOptions.NGOS)
         }).addTo(leafletMap).bindPopup(`🤝 NGO: ${ngo.name}`);
         setNgoMarkers({ [`ngo-${ngo.id}`]: marker });
       }
     };

     const updateRoute = (data, lat, lng, leafletMap) => {
       const waypoints = [
         L.latLng(lat, lng),
         L.latLng(data.hotels[0].latitude, data.hotels[0].longitude),
         L.latLng(data.ngos[0].latitude, data.ngos[0].longitude)
       ];

       if (!routingControl) {
         const control = L.Routing.control({
           waypoints: waypoints,
           addWaypoints: false,
           draggableWaypoints: false,
           createMarker: function () {
             return null;
           },
           lineOptions: {
             styles: [{ weight: 4 }]
           }
         }).addTo(leafletMap);
         setRoutingControl(control);
       } else {
         routingControl.setWaypoints(waypoints);
       }
     };

     return (
       <div>
         {/* Header */}
         <header>
           <div className="header-content">
             <div>
               <h1>🍽️ AnnaPurna</h1>
               <p className="tagline">Connecting surplus food to those in need</p>
             </div>
           </div>
         </header>

         {/* Legend */}
         <div className="legend">
           <div className="legend-item">
             <span className="legend-icon hotel-icon"></span>
             <span>Hotels & Restaurants</span>
           </div>
           <div className="legend-item">
             <span className="legend-icon ngo-icon"></span>
             <span>NGOs</span>
           </div>
           <div className="legend-item">
             <span className="legend-icon user-icon"></span>
             <span>Active Users</span>
           </div>
         </div>

         {/* Map Container */}
         <div className="map-wrapper">
           {/* Stats Bar */}
           <div className="stats-bar">
             <div className="stat-card">
               <div className="stat-number">{hotelCount}</div>
               <div className="stat-label">Hotels</div>
             </div>
             <div className="stat-card">
               <div className="stat-number">{ngoCount}</div>
               <div className="stat-label">NGOs</div>
             </div>
             <div className="stat-card">
               <div className="stat-number">{userCount}</div>
               <div className="stat-label">Active Users</div>
             </div>
           </div>

           {/* Map */}
           <div id="map" ref={mapRef} style={{ height: '500px', width: '100%' }}></div>
         </div>
       </div>
     );
   };

   export default AnnaPurnaMap;
   