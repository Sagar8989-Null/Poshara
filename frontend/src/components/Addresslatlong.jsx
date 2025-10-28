import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../CSS/Map.css";

const Addresslatlong = () => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
    });


    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            // socket.current.emit("send-location", { latitude, longitude });
            currentlatitude,currentlongitude =  latitude,longitude;
        },
        (error) => console.error(error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    const [position, setPosition] = useState([latitude, longitude]);

    const handleDragEnd = (e) => {
        const latlng = e.target.getLatLng();
        setPosition([latlng.lat, latlng.lng]);
        console.log("New Position:", latlng);
    };

    return (
        <MapContainer center={position} zoom={13} style={{ height: "50vh", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
                position={position}
                draggable={true}
                eventHandlers={{ dragend: handleDragEnd }}
            >
                <Popup>Drag me to change location!</Popup>
            </Marker>
        </MapContainer>
    );
};

export default Addresslatlong;
