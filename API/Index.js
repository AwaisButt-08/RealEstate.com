import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// 1. Initialize dotenv before importing routes that might rely on process.env
dotenv.config();

// 2. Import route handlers
import userRoutes from "./Routes/user-routes.js";
import authRoutes from "./Routes/auth-route.js";
import listingRouter from "./Routes/listing.route.js";

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const app = express();

// Standard middleware
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/listing", listingRouter);

// Global Error Handler (must be defined AFTER routes and BEFORE app.listen)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// Start listening after all routes and middleware are registered
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});