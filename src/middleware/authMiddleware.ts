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
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found, authorization denied" });
    }

    req.user = user;
  } catch (error) {
    console.error("Error during token verification:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
  next();
};

export default authMiddleware;
