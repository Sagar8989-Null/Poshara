// backend/server.js
import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import fetch from "node-fetch";


dotenv.config();


// ✅ Fetch driving distance from OSRM (real road distance)
const getDrivingDistance = async (startLat, startLng, endLat, endLng) => {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=false`;

    const res = await fetch(url);

    // ✅ Check if response is actually JSON
    const text = await res.text();
    if (!res.ok) {
      console.error(`❌ OSRM error: ${res.status} ${res.statusText}`);
      return null;
    }

    // ✅ If the response starts with '<', it's HTML (an error page)
    if (text.trim().startsWith("<")) {
      console.error("❌ OSRM returned HTML instead of JSON. The public server might be down.");
      return null;
    }

    // ✅ Parse JSON safely
    const data = JSON.parse(text);

    if (data?.routes?.length) {
      const distanceInKm = data.routes[0].distance / 1000;
      return distanceInKm.toFixed(2);
    }
    // if (data.routes && data.routes.length > 0) {
    //   const distanceInKm = data.routes[0].distance / 1000; // convert meters → km
    //   // console.log(
    //   // //   `🛰️ OSRM distance from (${startLat}, ${startLng}) → (${endLat}, ${endLng}):`,
    //   // //   (data.routes && data.routes.length > 0) ? (data.routes[0].distance / 1000).toFixed(2) + " km" : "No route"
    //   // // );

    //   return distanceInKm.toFixed(2);
    // }
    return null;
  } catch (err) {
    console.error("Error fetching OSRM distance:", err);
    return null;
  }
};


// 🧠 In-memory cache for donation distances (reset when server restarts)
const distanceCache = new Map();

// ✅ Helper: Generate unique key per NGO–Restaurant pair
function makeCacheKey(ngoLat, ngoLon, restLat, restLon) {
  return `${ngoLat},${ngoLon}-${restLat},${restLon}`;
}

// ✅ Enhanced version of getDrivingDistance() with caching + retry limit
async function getCachedDistance(startLat, startLng, endLat, endLng) {
  const key = makeCacheKey(startLat, startLng, endLat, endLng);

  // 1️⃣ If cached (including N/A), just return it
  if (distanceCache.has(key)) return distanceCache.get(key);

  // 2️⃣ Limit concurrent new OSRM requests to 3 max
  if (getCachedDistance.activeRequests >= 3) {
    // If too many requests happening, skip and mark as pending or N/A
    return "N/A";
  }

  getCachedDistance.activeRequests++;
  let distance = null;

  try {
    distance = await getDrivingDistance(startLat, startLng, endLat, endLng);
  } catch (err) {
    console.error("OSRM fetch failed:", err);
    distance = null;
  } finally {
    getCachedDistance.activeRequests--;
  }

  // 3️⃣ Store result (even if N/A) so it’s not requested again
  distanceCache.set(key, distance ?? "N/A");
  return distance ?? "N/A";
}
getCachedDistance.activeRequests = 0;


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

// ✅ CREATE DONATION (Restaurant)
app.post("/api/donations", async (req, res) => {
  try {
    let {
      restaurant_id,
      food_name,
      food_variety,
      food_category,
      quantity,
      unit,
      expiry_time,
      description,
      status,
    } = req.body;

    if (!restaurant_id || !food_name || !food_variety || !food_category || !quantity || !unit)
      return res.status(400).json({ error: "Missing required fields" });

    if (food_category === "Cooked" && !expiry_time) {
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 4);
      expiry_time = expiry.toISOString().slice(0, 19).replace("T", " ");
    } else {
      expiry_time = new Date(expiry_time).toISOString().slice(0, 19).replace("T", " ");
    }

    const [result] = await db.query(
      `INSERT INTO donations 
        (restaurant_id, food_name, food_variety, food_category, quantity, unit, expiry_time, description, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        restaurant_id,
        food_name,
        food_variety,
        food_category,
        quantity,
        unit,
        expiry_time,
        description || "",
        status || "available",
      ]
    );

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

// ✅ GET ALL AVAILABLE DONATIONS (with real distance using restaurant_id)
app.get("/api/donations/available", async (req, res) => {
  try {
    const { food_variety, food_category, min_servings, ngo_lat, ngo_lon } = req.query;

    if (!ngo_lat || !ngo_lon) {
      return res.status(400).json({ error: "NGO coordinates (ngo_lat, ngo_lon) are required" });
    }

    // Step 1: Base SQL (JOIN donations with restaurants)
    let sql = `
      SELECT 
        d.donation_id,
        d.food_name,
        d.food_variety,
        d.food_category,
        d.quantity,
        d.unit,
        d.expiry_time,
        d.status,
        d.restaurant_id,
        r.name AS restaurant_name,
        r.latitude AS restaurant_lat,
        r.longitude AS restaurant_lon
      FROM donations d
      JOIN restaurants r ON d.restaurant_id = r.restaurant_id
      WHERE d.status = 'available'
    `;

    const params = [];

    // Step 2: Apply optional filters
    if (food_variety) {
      sql += " AND d.food_variety = ?";
      params.push(food_variety);
    }
    if (food_category) {
      sql += " AND d.food_category = ?";
      params.push(food_category);
    }
    if (min_servings) {
      sql += " AND d.quantity >= ?";
      params.push(Number(min_servings));
    }

    // Step 3: Run query
    const [rows] = await db.query(sql, params);

    // Step 4: Fetch real driving distance (cached and limited)
    const donationsWithDistance = await Promise.all(
      rows.map(async (d) => {
        const distance = await getCachedDistance(
          parseFloat(ngo_lat),
          parseFloat(ngo_lon),
          parseFloat(d.restaurant_lat),
          parseFloat(d.restaurant_lon)
        );
        return { ...d, distance };
      })
    );

    // Step 5: Sort by nearest first
    donationsWithDistance.sort((a, b) => {
      if (a.distance === "N/A") return 1;
      if (b.distance === "N/A") return -1;
      return a.distance - b.distance;
    });

    // console.log("🧭 Available Donations with distance:", donationsWithDistance);


    res.json(donationsWithDistance);
  } catch (error) {
    console.error("❌ Error fetching available donations:", error);
    res.status(500).json({ error: "Failed to fetch available donations" });
  }
});



// ✅ NGO ACCEPTS DONATION
app.put("/api/donations/:id/accept", async (req, res) => {
  try {
    const { id } = req.params;
    const { ngo_id } = req.body;

    if (!ngo_id) return res.status(400).json({ error: "ngo_id is required" });

    const [ngoCheck] = await db.query("SELECT ngo_id FROM ngos WHERE ngo_id = ?", [ngo_id]);
    if (ngoCheck.length === 0) return res.status(400).json({ error: "NGO not found in database" });

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

// ✅ GET ALL ACCEPTED DONATIONS (with OSRM driving distance)
app.get("/api/donations/accepted", async (req, res) => {
  try {
    const { ngo_lat, ngo_lon } = req.query;

    if (!ngo_lat || !ngo_lon) {
      return res.status(400).json({ error: "NGO coordinates (ngo_lat, ngo_lon) are required" });
    }

    // Step 1: Get all accepted donations
    const sql = `
      SELECT 
        d.donation_id,
        d.food_name,
        d.food_variety,
        d.food_category,
        d.quantity,
        d.unit,
        d.expiry_time,
        d.status,
        d.restaurant_id,
        r.name AS restaurant_name,
        r.latitude AS restaurant_lat,
        r.longitude AS restaurant_lon
      FROM donations d
      JOIN restaurants r ON d.restaurant_id = r.restaurant_id
      WHERE d.status = 'accepted'
    `;
    const [rows] = await db.query(sql);

    // Step 2: Fetch OSRM distances
    const results = await Promise.all(
      rows.map(async (donation) => {
        const distance = await getCachedDistance(
          parseFloat(ngo_lat),
          parseFloat(ngo_lon),
          parseFloat(donation.restaurant_lat),
          parseFloat(donation.restaurant_lon)
        );
        return { ...donation, distance };
      })
    );


    // Step 3: Sort by nearest first
    results.sort((a, b) => {
      if (a.distance === "N/A") return 1;
      if (b.distance === "N/A") return -1;
      return a.distance - b.distance;
    });

    res.json(results);
  } catch (error) {
    console.error("❌ Error fetching accepted donations:", error);
    res.status(500).json({ error: "Failed to fetch accepted donations" });
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
    s
    console.error("Error fetching NGO donations:", error);
    res.status(500).json({ error: "Failed to fetch NGO donations" });
  }
});

// ✅ GET DONATION DETAILS (for NGO + Volunteer maps)
app.get("/api/donations/:id/details", async (req, res) => {
  try {
    const { id } = req.params;
    const [donation] = await db.query("SELECT * FROM donations WHERE donation_id = ?", [id]);
    if (donation.length === 0) return res.status(404).json({ error: "Donation not found" });

    const donationData = donation[0];

    // Restaurant
    const [restaurant] = await db.query(
      "SELECT latitude, longitude, name FROM restaurants WHERE restaurant_id = ?",
      [donationData.restaurant_id]
    );

    // NGO
    let ngoLocation = null;
    if (donationData.ngo_id) {
      const [ngo] = await db.query(
        "SELECT latitude, longitude, organization_name FROM ngos WHERE ngo_id = ?",
        [donationData.ngo_id]
      );
      if (ngo.length > 0)
        ngoLocation = {
          lat: ngo[0].latitude,
          lng: ngo[0].longitude,
          name: ngo[0].organization_name,
        };
    }

    // Volunteer (if assigned)
    let volunteerLocation = null;
    if (donationData.volunteer_id) {
      const [vol] = await db.query(
        "SELECT latitude, longitude, name FROM volunteers WHERE volunteer_id = ?",
        [donationData.volunteer_id]
      );
      if (vol.length > 0)
        volunteerLocation = {
          lat: vol[0].latitude,
          lng: vol[0].longitude,
          name: vol[0].name,
        };
    }

    res.json({
      donation: donationData,
      restaurant: restaurant.length
        ? {
          lat: restaurant[0].latitude,
          lng: restaurant[0].longitude,
          name: restaurant[0].name,
        }
        : null,
      ngo: ngoLocation,
      volunteer: volunteerLocation,
    });
  } catch (error) {
    console.error("Error fetching donation details:", error);
    res.status(500).json({ error: "Failed to fetch donation details" });
  }
});

// ✅ Get all donations accepted by NGOs (for volunteers)
app.get("/api/volunteer/accepted", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        d.donation_id,
        d.food_name,
        d.food_variety,
        d.food_category,
        d.quantity,
        d.unit,
        d.status,
        d.description,
        d.expiry_time,
        d.volunteer_id,
        d.created_at,
        r.name AS restaurant_name,
        r.latitude AS restaurant_lat,
        r.longitude AS restaurant_lng,
        n.organization_name AS ngo_name,
        n.latitude AS ngo_lat,
        n.longitude AS ngo_lng
      FROM donations d
      LEFT JOIN restaurants r ON d.restaurant_id = r.restaurant_id
      LEFT JOIN ngos n ON d.ngo_id = n.ngo_id
      WHERE d.status IN ('accepted', 'picked_up')
      ORDER BY d.created_at DESC
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

// ✅ Volunteer accepts donation (pickup)
app.put("/api/volunteer/accept/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { volunteer_id } = req.body;

    if (!volunteer_id) return res.status(400).json({ error: "volunteer_id is required" });

    const [volCheck] = await db.query("SELECT volunteer_id FROM volunteers WHERE volunteer_id = ?", [volunteer_id]);
    if (volCheck.length === 0) return res.status(404).json({ error: "Volunteer not found" });

    await db.query(
      "UPDATE donations SET volunteer_id = ?, status = 'picked_up' WHERE donation_id = ?",
      [volunteer_id, id]
    );

    res.json({ message: "Donation accepted for delivery" });
  } catch (error) {
    console.error("Error accepting donation:", error);
    res.status(500).json({ error: "Failed to assign volunteer" });
  }
});

// ✅ Volunteer marks delivery complete
app.put("/api/volunteer/deliver/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("UPDATE donations SET status = 'delivered' WHERE donation_id = ?", [id]);
    res.json({ message: "Donation marked as delivered" });
  } catch (error) {
    console.error("Error delivering donation:", error);
    res.status(500).json({ error: "Failed to mark delivered" });
  }
});

// ✅ START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
