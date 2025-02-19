import { Request, Response, NextFunction } from "express";

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access forbidden: Insufficient permissions" });
    }
    next();
  };
};
