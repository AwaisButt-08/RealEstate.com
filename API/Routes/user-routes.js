import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  getUserListings,
  getUser,
} from "../Controller/User-controller.js";
import { verifyToken } from "../Utils/verifyUser.js";

const router = express.Router();

// 1. Static / Health Check Routes
router.get("/test", test);

// 2. Specific Sub-Resource Routes (Must come BEFORE dynamic /:id)
// router.get("/listings/me", verifyToken, getUserListings);
router.get("/listings/:id", verifyToken, getUserListings);

// 3. User Action Routes
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);

// 4. Dynamic Parameter Route (Must be LAST so it doesn't swallow other endpoints)
router.get("/:id", verifyToken, getUser);

export default router;