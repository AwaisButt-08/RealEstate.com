import express from "express";
import { test } from "../Controller/USer-controller.js";

const router = express.Router();

router.get("/test", test);

export default router;