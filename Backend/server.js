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

// ✅ SIGNUP
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password, role, latitude, longitude } = req.body;

  if (!name || !email || !password || !role)
    return res.status(400).json({ message: "All fields required" });

  if ((role === "restaurant" || role === "ngo") && (!latitude || !longitude))
    return res.status(400).json({ message: "Please set your location on the map" });

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
      await db.query("INSERT INTO volunteers (volunteer_id) VALUES (?)", [userId]);
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ LOGIN
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "All fields required" });

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0)
      return res.status(401).json({ message: "Invalid email or password" });

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword)
      return res.status(401).json({ message: "Invalid email or password" });

    let locationQuery = "";
    if (user.role === "restaurant")
      locationQuery = "SELECT latitude, longitude FROM restaurants WHERE restaurant_id = ?";
    else if (user.role === "ngo")
      locationQuery = "SELECT latitude, longitude FROM ngos WHERE ngo_id = ?";
    else
      locationQuery = "SELECT NULL AS latitude, NULL AS longitude";

    const [loc] = await db.query(locationQuery, [user.user_id]);
    const coords = loc[0] || { latitude: null, longitude: null };

    res.json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        name: user.name,
        role: user.role,
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ LEADERBOARD
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
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ CREATE DONATION
app.post("/api/donations", async (req, res) => {
  try {
    let { restaurant_id, food_type, quantity, unit, expiry_time, description, status } = req.body;

    if (!restaurant_id || !food_type || !quantity || !unit || !expiry_time)
      return res.status(400).json({ error: "Missing required fields" });

     if (!expiry_time && food_type === "unpackaged") {
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 4);
      expiry_time = expiry.toISOString().slice(0, 19).replace("T", " ");
    }

    // ✅ Convert to MySQL datetime format
    if (expiry_time) {
      expiry_time = new Date(expiry_time).toISOString().slice(0, 19).replace("T", " ");
    }

    const query = `
      INSERT INTO donations 
      (restaurant_id, food_type, quantity, unit, expiry_time, description, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      restaurant_id,
      food_type,
      quantity,
      unit,
      expiry_time,
      description || "",
      status || "available",
    ]);

    res.status(201).json({
      message: "Donation created successfully",
      donation_id: result.insertId,
    });
  } catch (error) {
    console.error("Error creating donation:", error);
    res.status(500).json({ error: "Failed to create donation" });
  }
});

// ✅ GET DONATIONS BY RESTAURANT
app.get("/api/donations", async (req, res) => {
  try {
    const { restaurant_id } = req.query;

    if (!restaurant_id)
      return res.status(400).json({ error: "restaurant_id is required" });

    const [rows] = await db.query(
      "SELECT * FROM donations WHERE restaurant_id = ? ORDER BY created_at DESC",
      [restaurant_id]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
});

// ✅ DELETE DONATION
app.delete("/api/donations/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM donations WHERE donation_id = ?", [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Donation not found" });

    res.json({ message: "Donation deleted successfully" });
  } catch (error) {
    console.error("Error deleting donation:", error);
    res.status(500).json({ error: "Failed to delete donation" });
  }
});
// ✅ GET ALL AVAILABLE DONATIONS (for NGO Dashboard)
app.get("/api/donations/available", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM donations WHERE status = 'available' ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching available donations:", error);
    res.status(500).json({ error: "Failed to fetch available donations" });
  }
});

// ✅ NGO ACCEPTS DONATION (assign ngo_id + update status)
app.put("/api/donations/:id/accept", async (req, res) => {
  try {
    const { id } = req.params;
    const { ngo_id } = req.body;

    if (!ngo_id) return res.status(400).json({ error: "ngo_id is required" });

    // 🔹 Check if NGO exists
    const [ngoCheck] = await db.query("SELECT ngo_id FROM ngos WHERE ngo_id = ?", [ngo_id]);
    if (ngoCheck.length === 0)
      return res.status(400).json({ error: "NGO not found in database" });

    // 🔹 Proceed to update donation
    await db.query(
      "UPDATE donations SET ngo_id = ?, status = 'accepted' WHERE donation_id = ?",
      [ngo_id, id]
    );

    res.json({ message: "Donation accepted by NGO" });
  } catch (error) {
    console.error("Error accepting donation:", error);
    res.status(500).json({ error: "Failed to accept donation" });
  }
});

// ✅ Fetch all donations accepted by NGOs (for volunteers)
app.get("/api/donations/accepted", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM donations WHERE status = 'accepted'"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching picked donations:", error);
    res.status(500).json({ error: "Failed to fetch picked donations" });
  }
});

// ✅ GET NGO’S ASSIGNED DONATIONS
app.get("/api/donations/ngo/:ngo_id", async (req, res) => {
  try {
    const { ngo_id } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM donations WHERE ngo_id = ? ORDER BY created_at DESC",
      [ngo_id]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching NGO donations:", error);
    res.status(500).json({ error: "Failed to fetch NGO donations" });
  }
});

/* ===========================================================
   🚗 VOLUNTEER ROUTES
=========================================================== */

// ✅ Get all donations accepted by NGOs (ready for pickup)
app.get("/api/volunteer/accepted", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        d.donation_id,
        d.food_type,
        d.quantity,
        d.unit,
        d.status,
        d.description,
        r.name AS restaurant_name,
        r.latitude AS restaurant_lat,
        r.longitude AS restaurant_lng,
        n.organization_name AS ngo_name,
        n.latitude AS ngo_lat,
        n.longitude AS ngo_lng
      FROM donations d
      LEFT JOIN restaurants r ON d.restaurant_id = r.restaurant_id
      LEFT JOIN ngos n ON d.ngo_id = n.ngo_id
      WHERE d.status = 'accepted'
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching accepted donations:", error);
    res.status(500).json({ error: "Failed to fetch accepted donations" });
  }
});

// ✅ Volunteer picks up a donation
app.put("/api/volunteer/pickup/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { volunteer_id } = req.body;

    if (!volunteer_id)
      return res.status(400).json({ error: "volunteer_id is required" });

    await db.query(
      "UPDATE donations SET volunteer_id = ?, status = 'picked_up' WHERE donation_id = ?",
      [volunteer_id, id]
    );

    res.json({ message: "Donation picked up by volunteer" });
  } catch (error) {
    console.error("Error updating pickup:", error);
    res.status(500).json({ error: "Failed to update pickup" });
  }
});

// ✅ VOLUNTEER MARKS DELIVERY COMPLETE
app.put("/api/volunteer/deliver/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "UPDATE donations SET status = 'delivered' WHERE donation_id = ?",
      [id]
    );

    res.json({ message: "Donation marked as delivered" });
  } catch (error) {
    console.error("Error delivering donation:", error);
    res.status(500).json({ error: "Failed to update delivery" });
  }
});

// ✅ Volunteer Accept Donation
app.put("/api/volunteer/accept/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { volunteer_id } = req.body;

    if (!volunteer_id) return res.status(400).json({ error: "volunteer_id is required" });

    const [volCheck] = await db.query("SELECT volunteer_id FROM volunteers WHERE volunteer_id = ?", [volunteer_id]);
    if (volCheck.length === 0) return res.status(400).json({ error: "Volunteer not found" });

    await db.query(
      "UPDATE donations SET volunteer_id = ?, status = 'picked_up' WHERE donation_id = ?",
      [volunteer_id, id]
    );

    res.json({ message: "Donation accepted for delivery" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to assign volunteer" });
  }
});

// ✅ Volunteer Mark Delivered
app.put("/api/volunteer/deliver/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("UPDATE donations SET status = 'delivered' WHERE donation_id = ?", [id]);
    res.json({ message: "Donation marked as delivered" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to mark as delivered" });
  }
});



// ✅ START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
