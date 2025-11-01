import { db } from "../config/db.js";

// ✅ CREATE DONATION
export const createDonation = async (req, res) => {
  try {
    let { restaurant_id, food_type, quantity, unit, expiry_time, description, status } = req.body;
    if (!restaurant_id || !food_type || !quantity || !unit || !expiry_time)
      return res.status(400).json({ error: "Missing required fields" });

    if (!expiry_time && food_type === "unpackaged") {
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 4);
      expiry_time = expiry.toISOString().slice(0, 19).replace("T", " ");
    }

    expiry_time = new Date(expiry_time).toISOString().slice(0, 19).replace("T", " ");

    const [result] = await db.query(
      `INSERT INTO donations 
      (restaurant_id, food_type, quantity, unit, expiry_time, description, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [restaurant_id, food_type, quantity, unit, expiry_time, description || "", status || "available"]
    );

    res.status(201).json({ message: "Donation created successfully", donation_id: result.insertId });
  } catch (error) {
    console.error("Error creating donation:", error);
    res.status(500).json({ error: "Failed to create donation" });
  }
};

// ✅ Get donations by restaurant
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
    res.status(500).json({ error: "Failed to fetch donations" });
  }
};

// ✅ Delete donation
export const deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM donations WHERE donation_id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Donation not found" });

    res.json({ message: "Donation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete donation" });
  }
};


// ✅ GET DONATION DETAILS WITH LOCATIONS
app.get("/api/donations/:id/details", async (req, res) => {
  try {
    const { id } = req.params;
    const [donation] = await db.query(
      "SELECT * FROM donations WHERE donation_id = ?",
      [id]
    );
    
    if (donation.length === 0) {
      return res.status(404).json({ error: "Donation not found" });
    }

    const donationData = donation[0];
    
    // Get restaurant location
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
      if (ngo.length > 0) {
        ngoLocation = {
          lat: ngo[0].latitude,
          lng: ngo[0].longitude,
          name: ngo[0].organization_name
        };
      }
    }
    
    res.json({
      donation: donationData,
      restaurant: restaurant.length > 0 ? {
        lat: restaurant[0].latitude,
        lng: restaurant[0].longitude,
        name: restaurant[0].name
      } : null,
      ngo: ngoLocation
    });
  } catch (error) {
    console.error("Error fetching donation details:", error);
    res.status(500).json({ error: "Failed to fetch donation details" });
  }
});

// ✅ Accept, Pickup, Deliver, etc...
// (Reuse your existing functions here for each status update)