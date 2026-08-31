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
  // 1. Authorization Check
  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, "You can update only your account!"));
  }

  try {
    // Validate Mongo ID
     if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

       const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (String(req.user.id) !== String(req.params.id))
    return next(errorHandler(403, "You can delete only your account!"));
  try {
    await User.findByIdAndDelete(req.params.id)

    

    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "User have been deleted." });
  } catch (error) {
    next(error);
  }
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

// export const getUserListings = async (req, res, next) => {
//   try {
//     const userId = req.params.id || req.user.id;
//     const listings = await Listing.find({ userRef: userId });
//     res.status(200).json(listings);
//   } catch (error) {
//     next(error);
//   }
// };

// User-controller.js

export const getUserListings = async (req, res, next) => {
  if (String(req.user.id) === String(req.params.id)) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
};