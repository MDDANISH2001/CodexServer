import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/users.model";
import { IUser } from "../types/registerUser.type";

declare module "express" {
  export interface Request {
    user?: IUser;
  }
}
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "No token provided, authorization denied" });
    return;
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ message: "User not found, authorization denied" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error during token verification:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
