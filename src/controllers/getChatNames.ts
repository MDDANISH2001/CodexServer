import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import User from "../models/registerSchema";
import DirectChats from "../models/directChat";

// Define interfaces for better type safety
interface ChatUser {
  userId: ObjectId;
  username: string;
}

const getChatNames = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.query;

    if (!userId) {
      res.status(400).json({ message: "Sender Id is required" });
      return;
    }

    // Get all conversations where the userId is involved
    // and extract the other user's ID in a single pipeline
    const connectedUsers = await DirectChats.aggregate([
      {
        $match: {
          conversationIds: { $regex: userId }
        }
      },
      {
        $project: {
          otherUserId: {
            $cond: {
              if: { $eq: [{ $arrayElemAt: [{ $split: ["$conversationIds", "_._"] }, 0] }, userId] },
              then: { $arrayElemAt: [{ $split: ["$conversationIds", "_._"] }, 1] },
              else: { $arrayElemAt: [{ $split: ["$conversationIds", "_._"] }, 0] }
            }
          }
        }
      },
      {
        $lookup: {
          from: "users", // Replace with your actual users collection name
          let: { userId: { $toObjectId: "$otherUserId" } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$userId"] }
              }
            },
            {
              $project: {
                userId: "$_id",
                username: 1,
                _id: 0
              }
            }
          ],
          as: "userDetails"
        }
      },
      {
        $unwind: "$userDetails"
      },
      {
        $replaceRoot: { newRoot: "$userDetails" }
      }
    ]);

    console.log('connectedUsers :', connectedUsers);
    res.json(connectedUsers);

  } catch (error) {
    console.error("Error in getChatNames:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getChatNames;