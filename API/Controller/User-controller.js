import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../Models/user-model.js";
import Listing from "../Models/listing.model.js";
import { errorHandler } from "../Utils/error.js";


export function test(req, res) {
  res.json({
    message: "API route is working!",
  });
}

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(403, "You can update only your account!"));

  try {
    const updateData = {};

    if (req.body.username) updateData.username = req.body.username;
    if (req.body.email) updateData.email = req.body.email;
    if (req.body.password)
      updateData.password = bcrypt.hashSync(req.body.password, 10);
    if (req.body.profilePicture)
      updateData.profilePicture = req.body.profilePicture;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true },
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(403, "You can delete only your account!"));
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      await Listing.deleteMany({ userRef: req.params.id });
      return res
        .clearCookie("access_token")
        .status(200)
        .json({ message: "User listings have been deleted." });
    }

    await User.findByIdAndDelete(req.params.id);
    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "User has been deleted." });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({ message: "User signed out successfully." });
  } catch (error) {
    next(error);
  };

};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user.id;
    const listings = await Listing.find({ userRef: userId });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
