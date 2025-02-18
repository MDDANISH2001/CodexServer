import { Request, Response } from "express";
import GroupChat from "../../models/groupChat.model";

const fetchGroupChatList = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.query;

  if (!userId) {
    res.status(400).json({ message: "Invalid Request!!!" });
    return;
  }

  try {
    const groups = await GroupChat.find({
      $or: [
        { "activeUsers.userId": userId },
        { "inactiveUsers.userId": userId, "inactiveUsers.groupDeleted": false }
      ]
    }, "groupName keys groupProfile _id").exec();

    if (groups.length > 0) {
      res.status(200).json(groups);
    } else {
      res.status(404).json({ message: "No groups found for the provided userId" });
    }
  } catch (error) {
    console.error("Error during fetchGroupChatList:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default fetchGroupChatList;