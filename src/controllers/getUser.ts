import { Request, Response } from "express";
import User from "../models/registerSchema";

export const getUser = async (req: Request, res: Response) => {
  const { emails, usernames } = req.body;

  if (
    (!emails) &&
    (!usernames)
  ) {
    res
      .status(400)
      .json({
        message: "Invalid Request: UserName or email is required!",
      });
    return;
  }

  try {
    let query = {};
    let projection = "_id username profilePic";

    if (emails && emails.length > 0) {
      query = { email: { $in: emails } };
      if (emails.length === 1) {
        projection += " keys";
      }
    } else if (usernames && usernames.length > 0) {
      query = { username: { $in: usernames } };
      if (usernames.length === 1) {
        projection += " keys";
      }
    }

    const users = await User.find(query, projection).exec();
    users.length > 0
      ? res.status(200).json(users)
      : res.status(404).json({ message: "No users found" });
  } catch (error) {
    console.log("Error during getUserDetails:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
