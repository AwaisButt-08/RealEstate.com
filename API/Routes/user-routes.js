import express from "express";
import { test, updateUser } from "../Controller/User-controller.js";
import { verifyToken } from "../Utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);

router.put("/update/:id", verifyToken, updateUser);

export default router;