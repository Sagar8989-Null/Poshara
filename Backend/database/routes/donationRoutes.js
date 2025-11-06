// backend/routes/donationRoutes.js
import express from "express";
import {
  createDonation,
  getDonationsByRestaurant,
  deleteDonation,
  getAvailableDonations,
  acceptDonation,
  getAcceptedDonations,
  getNgoDonations,
  getDonationDetails,
} from "../controllers/donationController.js";

const router = express.Router();

// All Donation APIs exactly same as before

router.post("/", createDonation); // POST /api/donations
router.get("/", getDonationsByRestaurant); // GET /api/donations?restaurant_id=
router.delete("/:id", deleteDonation); // DELETE /api/donations/:id

router.get("/available", getAvailableDonations); // GET /api/donations/available
router.put("/:id/accept", acceptDonation); // PUT /api/donations/:id/accept
router.get("/accepted", getAcceptedDonations); // GET /api/donations/accepted

router.get("/ngo/:ngo_id", getNgoDonations); // GET /api/donations/ngo/:ngo_id
router.get("/:id/details", getDonationDetails); // GET /api/donations/:id/details

export default router;
