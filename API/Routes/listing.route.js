import express from "express";
import {
  createListing,
  deleteListings,
  updateListing,
  getListing,
  getListings,
} from "../Controller/listing-controller.js";
import { verifyToken } from "../Utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListings);
router.post("/update/:id", verifyToken, updateListing);
// For SHOWING LISTING PAGE
router.get("/get/:id", getListing);
// For Search API Route
router.get("/get", getListings);

export default router;
