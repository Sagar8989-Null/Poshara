const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ✅ SOCKET.IO: Real-time donation coordination
io.on("connection", (socket) => {
  console.log(`🟢 ${socket.id} connected`);

  // Join specific donation room
  socket.on("join-donation-room", (donationId) => {
    const room = `donation-${donationId}`;
    socket.join(room);
    console.log(`📦 ${socket.id} joined ${room}`);
  });

  // Restaurant creates donation
  socket.on("new-donation", (donationData) => {
    console.log("🆕 New donation:", donationData);
    io.emit("new-donation", donationData);
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
    const room = `donation-${data.donationId}`;
    socket.join(room);
    console.log(`📍 Volunteer ${data.volunteerId} updated location for ${room}`);
    socket.to(room).emit("volunteer-location", data);
  });

  // Generic location tracking
  socket.on("send-location", (data) => {
    socket.emit("recieve-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    console.log(`🔴 ${socket.id} disconnected`);
    io.emit("user-disconnected", socket.id);
  });
});

// ✅ REST API
app.get("/data", (req, res) => {
  res.json({ message: "Static data route not in use." });
});

// 🗺️ Serve frontend
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
