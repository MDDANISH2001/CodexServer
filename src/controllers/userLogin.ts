import { Request, Response } from "express";
import User from "../models/registerSchema";
import { hashing } from "../utils/hashPswd";
import jwt from "jsonwebtoken";

export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Invalid Request" });
    return;
  }

  try {
    const user = await User.findOne({ email: email }).exec();

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }
    
    const planPassword = password;
    const dbPassword = user.password;

    if (hashing.matchPassword(planPassword, dbPassword)) {
      const authToken = jwt.sign(
        { userId: user._id, email: user.email, userName: user.username, profilePic: user.profilePic},
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      res.json({
        authToken,
        message: "LoggedIn Successfull!",
      });
    } else {
      res.status(400).json({ message: "Internal Server Error" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
