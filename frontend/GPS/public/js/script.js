const socket = io();
const map = L.map("map").setView([20.593683, 78.962883], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "AnnaPurna" }).addTo(map);

let latestLatitude = null;
let latestLongitude = null;
let routingControl = null;

fetch('/data')
    .then(response => response.json())
    .then(Data => {
        window.appData = Data; // Store globally for use after location update
        initializeMarkers(Data);
    })
    .catch(error => console.error('Error loading data:', error));

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
    // if (Data.hotels) {
    //     Data.hotels.forEach(hotel => {
    //         hotelMarkers[`hotel-${hotel.id}`] = L.marker([hotel.latitude, hotel.longitude], {
    //             icon: L.icon(iconOptions.Hotels)
    //         }).addTo(map).bindPopup(`🏨 Hotel: ${hotel.name}`);
    //     });
    // }

    // Add NGO markers
    // if (Data.ngos) {
    //     Data.ngos.forEach(ngo => {
    //         ngoMarkers[`ngo-${ngo.id}`] = L.marker([ngo.latitude, ngo.longitude], {
    //             icon: L.icon(iconOptions.NGOS)
    //         }).addTo(map).bindPopup(`🤝 NGO: ${ngo.name}`);
    //     });
    // }

    hotelMarkers[`hotel-${Data.hotels[0].id}`] = L.marker([Data.hotels[0].latitude, Data.hotels[0].longitude], {
        icon: L.icon(iconOptions.Hotels)
    }).addTo(map).bindPopup(`🏨 Hotel: ${Data.hotels[0].name}`);

    ngoMarkers[`ngo-${Data.ngos[0].id}`] = L.marker([Data.ngos[0].latitude, Data.ngos[0].longitude], {
        icon: L.icon(iconOptions.NGOS)
    }).addTo(map).bindPopup(`🤝 NGO: ${Data.ngos[0].name}`);
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

    latestLatitude = latitude;
    latestLongitude = longitude;

    map.setView([latitude, longitude], 15);

    if (userMarkers[id]) {
        userMarkers[id].setLatLng([latitude, longitude]);
    } else {
        userMarkers[id] = L.marker([latitude, longitude], {
            icon: L.icon(iconOptions.USER)
        // }).addTo(map).bindPopup("📍 User Location");
        }).addTo(map).bindPopup(` User ID - ${id}`);
    }

    // ✅ Only call routing when Data is loaded and location is available
    if (window.appData && latestLatitude !== null && latestLongitude !== null) {
        updateRoute(window.appData, latestLatitude, latestLongitude);
    }

});

function updateRoute(Data, lat, lng) {

    const waypoints = [
        L.latLng(lat, lng),
        L.latLng(Data.hotels[0].latitude, Data.hotels[0].longitude),
        L.latLng(Data.ngos[0].latitude, Data.ngos[0].longitude)
    ];

    if (!routingControl) {
        routingControl = L.Routing.control({
            waypoints: waypoints,
            addWaypoints: false,
            draggableWaypoints: false,
            createMarker: function () {
                return null;  // ✅ HIDE DEFAULT BLUE MARKERS
            },
            lineOptions: {
                styles: [{ weight: 4 }]
            }
        }).addTo(map);
    } else {
        routingControl.setWaypoints(waypoints);
    }
}

socket.on("user-disconnected", (id) => {
    if (userMarkers[id]) {
        map.removeLayer(userMarkers[id]);
        delete userMarkers[id];
    }
});
