const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors()); // For Express routes (optional, but kept for consistency)

const http = require("http");
const path = require("path");
const data = require("./public/js/data.json");

const socketio = require("socket.io");
const server = http.createServer(app);

// Enable CORS for Socket.io
const io = socketio(server, {
  cors: {
    origin: "*", // Allow all origins (for dev); change to "http://localhost:5173" for production security
    methods: ["GET", "POST"]
  }
});

// Serve static files from the React build directory (Vite's "dist" folder)
app.use(express.static(path.join(__dirname, "dist")));

// Keep serving other static files if needed (e.g., for assets like images)
app.use(express.static(path.join(__dirname, "public")));

// Socket.io connection handling
io.on("connection", function(socket) {
    socket.on("send-location", function(data) {
        socket.emit("recieve-location", {
            id: socket.id,
            ...data
        });
    });

    console.log(`${socket.id} - connected`);

    socket.on("disconnect", function() {
        socket.emit("user-disconnected", socket.id);
        console.log(`${socket.id} - disconnected`);
    });
});

// API route for data
app.get("/data", (req, res) => {
    try {
        res.json(data);
    } catch (error) {
        console.error("Error serving data:", error);
        res.status(500).json({ error: "Failed to load data" });
    }
});

// Catch-all handler for client-side routing: Serve the React app for any unmatched routes
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access the app at http://localhost:${PORT}`);
});
