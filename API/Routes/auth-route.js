import express from "express";
import {signup, signin, signOut,google } from "../Controller/auth-controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post('/google', google);
router.get("/signout", signOut);


export default router;
