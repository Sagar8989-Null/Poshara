// backend/routes/volunteerRoutes.js
import express from "express";
import {
  getAcceptedForVolunteers,
  pickupDonation,
  acceptDonation,
  deliverDonation,
} from "../controllers/volunteerController.js";

const router = express.Router();

// All Volunteer APIs exactly as before

router.get("/accepted", getAcceptedForVolunteers); // GET /api/volunteer/accepted
router.put("/pickup/:id", pickupDonation); // PUT /api/volunteer/pickup/:id
router.put("/accept/:id", acceptDonation); // PUT /api/volunteer/accept/:id
router.put("/deliver/:id", deliverDonation); // PUT /api/volunteer/deliver/:id

export default router;
