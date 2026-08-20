import bcrypt from "bcryptjs";
import User from "../Models/user-model.js";
import { errorHandler } from "../Utils/error.js";

export function test(req, res) {
  res.json({
    message: "API route is working!",
  });
};

export const updateUser = async (req, res, next) => {
  if(req.user.id !== req.params.id) return next(errorHandler(403, "You can update only your account!"));

  try{
    const updateData = {};
    
    if(req.body.username) updateData.username = req.body.username;
    if(req.body.email) updateData.email = req.body.email;
    if(req.body.password) updateData.password = bcrypt.hashSync(req.body.password, 10);
    if(req.body.profilePicture) updateData.profilePicture = req.body.profilePicture;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, 
      { $set: updateData },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch(error) {
    next(error);
  }
};

