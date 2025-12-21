// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import donationRoutes from "./routes/donationRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import authRoutes from "./routes/authRoutes.js"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/donations", donationRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/auth", authRoutes)

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", time: new Date() });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
