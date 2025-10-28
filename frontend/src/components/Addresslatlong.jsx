import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// import "../CSS/Map.css";

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

    const [position, setPosition] = useState([20.593683, 78.962883]);

    useEffect(() => {
        const watcher = navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setPosition([latitude, longitude]);
            },
            (err) => {
                console.error("Geolocation error:", err),
                    { enableHighAccuracy: true }
            }
        );
    }, []);


    const handleDragEnd = (e) => {
        const latlng = e.target.getLatLng();
        setPosition([latlng.lat, latlng.lng]);
        console.log("New Position:", latlng);
    };

    function RecenterMap({ position }) {
        const map = useMap();
        map.setView(position);
        return null;
    }

    return (
        <MapContainer center={position} zoom={15} style={{ height: '500px', width: '100%' }}>
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
            <RecenterMap position={position} />
        </MapContainer>
    );
};

export default Addresslatlong;
