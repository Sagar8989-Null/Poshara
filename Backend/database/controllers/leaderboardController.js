import { db } from "../config/db.js";

export const getLeaderboard = async (req, res) => {
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
};
