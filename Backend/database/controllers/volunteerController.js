// backend/controllers/volunteerController.js
import { db } from "../db.js";

// ✅ Get all donations accepted by NGOs (for volunteers)
export const getAcceptedForVolunteers = async (req, res) => {
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
};

// ✅ Volunteer picks up a donation
export const pickupDonation = async (req, res) => {
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
};

// ✅ Volunteer accepts donation (pickup)
export const acceptDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const { volunteer_id } = req.body;

    if (!volunteer_id)
      return res.status(400).json({ error: "volunteer_id is required" });

    const [volCheck] = await db.query(
      "SELECT volunteer_id FROM volunteers WHERE volunteer_id = ?",
      [volunteer_id]
    );
    if (volCheck.length === 0)
      return res.status(404).json({ error: "Volunteer not found" });

    await db.query(
      "UPDATE donations SET volunteer_id = ?, status = 'picked_up' WHERE donation_id = ?",
      [volunteer_id, id]
    );

    res.json({ message: "Donation accepted for delivery" });
  } catch (error) {
    console.error("Error accepting donation:", error);
    res.status(500).json({ error: "Failed to assign volunteer" });
  }
};

// ✅ Volunteer marks delivery complete
export const deliverDonation = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("UPDATE donations SET status = 'delivered' WHERE donation_id = ?", [id]);
    res.json({ message: "Donation marked as delivered" });
  } catch (error) {
    console.error("Error delivering donation:", error);
    res.status(500).json({ error: "Failed to mark delivered" });
  }
};
