import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET_KEY } from "../config/constants";

declare global {
  namespace Express {
    interface Request {
      user?: any; // Attach user to request
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded; // Store user data in request object
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
