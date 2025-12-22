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
const normalizeOrigin = (origin) => 
  origin?.replace(/\/$/, ""); // remove trailing slash


const allowedOrigins = [
  normalizeOrigin(process.env.Frontend_URL),
  "http://localhost:5173",
].filter(Boolean); // removes undefined


const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const normalizedOrigin = normalizeOrigin(origin);

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(null, true); // ❗ allow but do NOT expose origin
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // 🔥 REQUIRED for preflight
app.use(express.json());




const io = new Server(server, {
  transports: ["websocket"],
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
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
