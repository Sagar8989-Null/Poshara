import express from "express";
import {
  createDonation,
  getDonationsByRestaurant,
  deleteDonation,
} from "../controllers/donationController.js";

const router = express.Router();

router.post("/", createDonation);
router.get("/", getDonationsByRestaurant);
router.delete("/:id", deleteDonation);

export default router;
