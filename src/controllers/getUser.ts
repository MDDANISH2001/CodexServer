import { Request, Response } from "express";
import User from "../models/users.model";

export const getUser = async (req: Request, res: Response) => {
  const { emails, _id } = req.body;

  if (
    (!emails) &&
    (!_id)
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
    } else if (_id && _id.length > 0) {
      query = { username: { $in: _id } };
      if (_id.length === 1) {
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
