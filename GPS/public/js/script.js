const socket = io();
const map = L.map("map").setView([20.593683, 78.962883], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "AnnaPurna" }).addTo(map);

fetch('/data')
    .then(response => response.json())
    .then(Data =>{
        initializeMarkers(Data);
    })
    .catch(error => console.error('Error loading data:',error));

const iconOptions = {
    Hotels: {
        iconUrl: 'photos/red.png', 
        iconSize: [30, 30]
    },
    NGOS: {
        iconUrl: 'photos/green.png',
        iconSize: [30, 30]
    },
    USER: {
        iconUrl: 'photos/tracker.png',
        iconSize: [30, 30]
    }
};

// ✅ Separate marker objects to avoid overwrite
const hotelMarkers = {};
const ngoMarkers = {};
const userMarkers = {};

function initializeMarkers(Data) {
    // Add Hotel markers
    if (Data.hotels) {
        Data.hotels.forEach(hotel => {
            hotelMarkers[`hotel-${hotel.id}`] = L.marker([hotel.latitude, hotel.longitude], {
                icon: L.icon(iconOptions.Hotels)
            }).addTo(map).bindPopup(`🏨 Hotel: ${hotel.name}`);
        });
    }

    // Add NGO markers
    if (Data.ngos) {
        Data.ngos.forEach(ngo => {
            ngoMarkers[`ngo-${ngo.id}`] = L.marker([ngo.latitude, ngo.longitude], {
                icon: L.icon(iconOptions.NGOS)
            }).addTo(map).bindPopup(`🤝 NGO: ${ngo.name}`);
        });
    }
}


// ✅ User location (via geolocation + socket)
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        }, 
        (error) => console.error(error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
}

socket.on("recieve-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 15);

    if (userMarkers[id]) {
        userMarkers[id].setLatLng([latitude, longitude]);
    } else {
        userMarkers[id] = L.marker([latitude, longitude], {
            icon: L.icon(iconOptions.USER)
        }).addTo(map).bindPopup("📍 User Location");
    }
});

socket.on("user-disconnected", (id) => {
    if (userMarkers[id]) {
        map.removeLayer(userMarkers[id]);
        delete userMarkers[id];
    }
});
