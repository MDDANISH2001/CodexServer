import { Request, Response } from "express";
import DirectChats from "../../models/directChat.model";
import Messages from "../../models/messages.model";

const fetchDirectMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { conversationId } = req.query;

  if (!conversationId) {
    res.status(400).json({ message: "Invalid Request!!!" });
    return;
  }

  try {
    const directChat = await DirectChats.findOne({
      conversationId: conversationId,
    }).exec();

    if (!directChat) {
      res
        .status(404)
        .json({
          message: "No direct chat found for the provided conversationId",
        });
      return;
    }

    const messageIds = directChat.sharedInfo;
    const messages = await Messages.find({ _id: { $in: messageIds } }).exec();

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error during fetchDirectMessages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default fetchDirectMessages;
