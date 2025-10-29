// backend/server.js
import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL promise pool
const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

try {
  await db.query("SELECT 1");
  console.log("✅ Connected to MySQL database (promise pool ready)");
} catch (err) {
  console.error("❌ Database connection failed:", err);
}


// Signup route
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password, role, latitude, longitude } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields required" });
  }

  if ((role === "restaurant" || role === "ngo") && (!latitude || !longitude)) {
    return res.status(400).json({ message: "Please set your location on the map" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    const userId = result.insertId;

    if (role === "restaurant") {
      await db.query(
        "INSERT INTO restaurants (restaurant_id, name, latitude, longitude) VALUES (?, ?, ?, ?)",
        [userId, name, latitude, longitude]
      );
    }

    if (role === "ngo") {
      await db.query(
        "INSERT INTO ngos (ngo_id, organization_name, latitude, longitude) VALUES (?, ?, ?, ?)",
        [userId, name, latitude, longitude]
      );
    }

    if (role === "volunteer") {
      await db.query(
        "INSERT INTO volunteers (volunteer_id) VALUES (?)",
        [userId]
      );
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// ✅ Login route
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "All fields required" });

  try {
    // find user by email
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0)
      return res.status(401).json({ message: "Invalid email or password" });

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword)
      return res.status(401).json({ message: "Invalid email or password" });

    // get coordinates depending on role
    let locationQuery = "";
    if (user.role === "restaurant") locationQuery = "SELECT latitude, longitude FROM restaurants WHERE restaurant_id = ?";
    if (user.role === "ngo") locationQuery = "SELECT latitude, longitude FROM ngos WHERE ngo_id = ?";
    if (user.role === "volunteer") locationQuery = "SELECT NULL AS latitude, NULL AS longitude";

    const [loc] = await db.query(locationQuery, [user.user_id]);
    const coords = loc[0] || { latitude: null, longitude: null };

    res.json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        name: user.name,
        role: user.role,
        latitude: coords.latitude,
        longitude: coords.longitude
      }
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Leaderboard route
app.get("/api/leaderboard", async (req, res) => {
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
  try {
    const [results] = await db.promise().query(sql);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
