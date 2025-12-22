import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

// Routes
import donationRoutes from "./routes/donationRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const Frontend_URL= process.env.Frontend_URL;




app.use(cors({
  origin: Frontend_URL, // replace with frontend domain in prod
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());




const io = new Server(server, {
  cors: {
    origin: Frontend_URL, // replace with frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`🟢 Socket connected: ${socket.id}`);

  socket.on("join-donation-room", (donationId) => {
    socket.join(`donation-${donationId}`);
  });

  socket.on("new-donation", (donationData) => {
    io.emit("new-donation", donationData);
  });

  socket.on("accept-donation", (data) => {
    io.to(`donation-${data.donationId}`).emit("donation-accepted", data);
  });

  socket.on("assign-volunteer", (data) => {
    io.to(`donation-${data.donationId}`).emit("volunteer-assigned", data);
  });

  socket.on("volunteer-location", (data) => {
    socket.to(`donation-${data.donationId}`).emit("volunteer-location", data);
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Socket disconnected: ${socket.id}`);
  });
});




app.use("/api/donations", donationRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", time: new Date() });
});




const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`🚀 API + Socket.IO running on port ${PORT}`);
});
