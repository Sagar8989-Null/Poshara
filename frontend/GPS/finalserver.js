const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
// const data = require("./public/js/data.json");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Enable CORS for Socket.io
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ✅ SOCKET.IO: Real-time donation coordination
io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  // Join specific donation room
  socket.on("join-donation-room", (donationId) => {
    socket.join(`donation-${donationId}`);
    console.log(`${socket.id} joined donation-${donationId}`);
  });

  // Restaurant creates donation
  socket.on("new-donation", (donationData) => {
    console.log("🆕 New donation:", donationData);
    io.emit("new-donation", donationData); // broadcast globally to NGOs
  });

  // NGO accepts donation
  socket.on("accept-donation", (data) => {
    console.log(`🤝 NGO accepted donation ${data.donationId}`);
    io.to(`donation-${data.donationId}`).emit("donation-accepted", data);
  });

  // Volunteer assigned
  socket.on("assign-volunteer", (data) => {
    console.log(`🚗 Volunteer assigned for donation ${data.donationId}`);
    io.to(`donation-${data.donationId}`).emit("volunteer-assigned", data);
  });

  // Volunteer live location
  socket.on("volunteer-location", (data) => {
    io.to(`donation-${data.donationId}`).emit("volunteer-location", data);
  });

  // Generic location tracking (for other use cases)
  socket.on("send-location", (data) => {
    socket.emit("recieve-location", {
      id: socket.id,
      ...data,
    });
  });

  // Handle disconnects
  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
    io.emit("user-disconnected", socket.id);
  });
});


// ✅ REST API
app.get("/data", (req, res) => {
  try {
    res.json(data);
  } catch (error) {
    console.error("Error serving data:", error);
    res.status(500).json({ error: "Failed to load data" });
  }
});

// 🗺️ Serve static React files (if you build your frontend)
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
