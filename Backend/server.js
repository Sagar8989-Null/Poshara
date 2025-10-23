import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // 🔹 Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 MySQL Connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// 🔹 Connect to database
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

// ✅ Route: Fetch Donations
app.get("/donations", (req, res) => {
  const sql = `
    SELECT d.donation_id, r.name AS restaurant, d.food_type, d.quantity, d.unit, d.status, d.description
    FROM donations d
    JOIN restaurants r ON d.restaurant_id = r.restaurant_id
    ORDER BY d.created_at DESC;
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ Route: Leaderboard
app.get("/leaderboard", (req, res) => {
  const sql = `
    SELECT u.name, u.role,
      COALESCE(r.total_donations, 0) AS donations,
      COALESCE(n.total_received, 0) AS received,
      COALESCE(v.total_transports, 0) AS transports
    FROM users u
    LEFT JOIN restaurants r ON u.user_id = r.restaurant_id
    LEFT JOIN ngos n ON u.user_id = n.ngo_id
    LEFT JOIN volunteers v ON u.user_id = v.volunteer_id
    ORDER BY (COALESCE(r.total_donations,0) + COALESCE(v.total_transports,0) + COALESCE(n.total_received,0)) DESC;
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 🔹 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
