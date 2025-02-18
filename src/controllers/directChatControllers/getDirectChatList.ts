import { Request, Response } from "express";
import DirectChats from "../../models/directChat.model";
import User from "../../models/users.model";

const fetchDirectChatList = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.query;

  if (!userId) {
    res.status(400).json({ message: "Invalid Request: userId is required" });
    return;
  }

  try {
    const directChats = await DirectChats.find({
      sharedInfo: { $regex: userId, $options: "i" }
    }, "conversationId").exec();

    if (!directChats || directChats.length === 0) {
      res.status(404).json({ message: "No direct chats found for the provided userId" });
      return;
    }

    const userIds = new Set<string>();
    const userConversations: { [key: string]: string } = {}; // Change from array to string

    directChats.forEach(chat => {
      const [user1Id, user2Id] = chat.conversationId.split("_._");
      if (user1Id !== userId) {
        userIds.add(user1Id);
        userConversations[user1Id] = chat.conversationId; // Store as a string
      }
      if (user2Id !== userId) {
        userIds.add(user2Id);
        userConversations[user2Id] = chat.conversationId; // Store as a string
      }
    });
    
    const users = await User.find({ _id: { $in: Array.from(userIds) } }, "_id username profilePic keys").exec();

    const usersWithConversations = users.map(user => ({
      ...user.toObject(),
      conversationIds: userConversations[user._id.toString()]
    }));

    res.status(200).json(usersWithConversations);
  } catch (error) {
    console.error("Error during fetchDirectChatList:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default fetchDirectChatList;
