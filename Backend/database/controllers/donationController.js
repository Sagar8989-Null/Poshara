// backend/controllers/donationController.js
import { db } from "../db.js";
import { getCachedDistance } from "../utils/osrm.js";

// ✅ CREATE DONATION (Restaurant)
export const createDonation = async (req, res) => {
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
};

// ✅ GET DONATIONS BY RESTAURANT
export const getDonationsByRestaurant = async (req, res) => {
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
};

// ✅ DELETE DONATION
export const deleteDonation = async (req, res) => {
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
};

// ✅ GET ALL AVAILABLE DONATIONS
export const getAvailableDonations = async (req, res) => {
  try {
    const { food_variety, food_category, min_servings, ngo_lat, ngo_lon } = req.query;

    if (!ngo_lat || !ngo_lon)
      return res.status(400).json({ error: "NGO coordinates (ngo_lat, ngo_lon) are required" });

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

    const [rows] = await db.query(sql, params);

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

    donationsWithDistance.sort((a, b) => {
      if (a.distance === "N/A") return 1;
      if (b.distance === "N/A") return -1;
      return a.distance - b.distance;
    });

    res.json(donationsWithDistance);
  } catch (error) {
    console.error("❌ Error fetching available donations:", error);
    res.status(500).json({ error: "Failed to fetch available donations" });
  }
};

// ✅ NGO ACCEPTS DONATION
export const acceptDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const { ngo_id } = req.body;

    if (!ngo_id) return res.status(400).json({ error: "ngo_id is required" });

    const [ngoCheck] = await db.query("SELECT ngo_id FROM ngos WHERE ngo_id = ?", [ngo_id]);
    if (ngoCheck.length === 0)
      return res.status(400).json({ error: "NGO not found in database" });

    await db.query(
      "UPDATE donations SET ngo_id = ?, status = 'accepted' WHERE donation_id = ?",
      [ngo_id, id]
    );

    res.json({ message: "Donation accepted by NGO" });
  } catch (error) {
    console.error("Error accepting donation:", error);
    res.status(500).json({ error: "Failed to accept donation" });
  }
};

// ✅ GET ALL ACCEPTED DONATIONS
export const getAcceptedDonations = async (req, res) => {
  try {
    const { ngo_lat, ngo_lon } = req.query;

    if (!ngo_lat || !ngo_lon)
      return res.status(400).json({ error: "NGO coordinates (ngo_lat, ngo_lon) are required" });

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
};

// ✅ GET NGO’S ASSIGNED DONATIONS
export const getNgoDonations = async (req, res) => {
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
};

// ✅ GET DONATION DETAILS (for NGO + Volunteer maps)
export const getDonationDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const [donation] = await db.query("SELECT * FROM donations WHERE donation_id = ?", [id]);
    if (donation.length === 0)
      return res.status(404).json({ error: "Donation not found" });

    const donationData = donation[0];

    const [restaurant] = await db.query(
      "SELECT latitude, longitude, name FROM restaurants WHERE restaurant_id = ?",
      [donationData.restaurant_id]
    );

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

    let volunteerLocation = null;
    if (donationData.volunteer_id) {
      const [vol] = await db.query(
        `SELECT u.name 
         FROM volunteers v
         JOIN users u ON v.volunteer_id = u.user_id
         WHERE v.volunteer_id = ?`,
        [donationData.volunteer_id]
      );
      if (vol.length > 0)
        volunteerLocation = { name: vol[0].name };
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
};
