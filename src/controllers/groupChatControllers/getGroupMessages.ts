import { Request, Response } from "express";
import GroupChat from "../../models/groupChat.model";
import Messages from "../../models/messages.model";
import User from "../../models/users.model";

const fetchGroupMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { groupId } = req.query;

  if (!groupId) {
    res.status(400).json({ message: "Invalid Request!!!" });
    return;
  }

  try {
    const group = await GroupChat.findById(groupId, "messages").exec();

    if (!group) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    const messageIds = group.messages;
    const messages = await Messages.find({ _id: { $in: messageIds } }).exec();

    const userIds = new Set(messages.map((msg) => msg.userId));
    const users = await User.find(
      { _id: { $in: Array.from(userIds) } },
      "_id username keys profilePic"
    ).exec();

    const userMap: Record<
      string,
      { _id: string; username: string; keys: any; profilePic: string }
    > = users.reduce(
      (
        acc: Record<
          string,
          { _id: string; username: string; keys: any; profilePic: string }
        >,
        user
      ) => {
        acc[user._id.toString()] = {
          _id: user._id.toString(),
          username: user.username,
          keys: user.keys,
          profilePic: user.profilePic,
        };
        return acc;
      },
      {}
    );

    const payload = {
      messages: messages.map((msg) => ({
        _id: msg._id.toString(),
        text: msg.message,
        userId: msg.userId,
        createdAt: msg.createdAt,
      })),
      users: userMap,
    };

    res.status(200).json(payload);
  } catch (error) {
    console.error("Error during fetchGroupMessages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default fetchGroupMessages;
