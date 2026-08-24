import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next(errorHandler(403, "Forbidden"));
      }

      req.user = user;
      next();
    });
    return;
  }

  const authorization = req.headers.authorization;
  if (authorization?.startsWith("Bearer ")) {
    try {
      const response = await fetch(
        `${process.env.VITE_SUPABASE_URL}/auth/v1/user`,
        {
          headers: {
            apikey: process.env.VITE_SUPABASE_ANON_KEY,
            Authorization: authorization,
          },
        },
      );

      if (response.ok) {
        const user = await response.json();
        req.user = { id: user.id };
        next();
        return;
      }
    } catch (error) {
      return next(errorHandler(401, "Unable to verify Supabase session"));
    }

    return next(errorHandler(401, "Unauthorized"));
  }

  return next(errorHandler(401, "Unauthorized"));
};
