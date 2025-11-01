import bcrypt from "bcryptjs";
import { db } from "../config/db.js";

// ✅ SIGNUP
export const signup = async (req, res) => {
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
    } else if (role === "ngo") {
      await db.query(
        "INSERT INTO ngos (ngo_id, organization_name, latitude, longitude) VALUES (?, ?, ?, ?)",
        [userId, name, latitude, longitude]
      );
    } else if (role === "volunteer") {
      await db.query("INSERT INTO volunteers (volunteer_id) VALUES (?)", [userId]);
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
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
    else locationQuery = "SELECT NULL AS latitude, NULL AS longitude";

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
};
