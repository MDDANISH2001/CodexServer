import { Request, Response } from "express";
import DirectChats from "../../models/directChat.model";
import Messages from "../../models/messages.model";

const manageDirectChats = async (req: Request, res: Response): Promise<void> => {
  const { messageObj } = req.body;
  const { convoId } = req.query;

  if (!convoId || !messageObj) {
    res.status(400).json({ message: "Invalid Request!!!" });
    return;
  }

  try {
    // Add the message object to the Messages collection
    const newMessage = await Messages.create(messageObj);
    const messageId = newMessage._id;

    // Check if the conversationId exists in the DirectChats collection
    const conversation = await DirectChats.findOne({ conversationId: convoId }).exec();

    if (conversation) {
      // If the conversation exists, add the messageId to the sharedInfo array
      conversation.sharedInfo.push(messageId.toString());
      await conversation.save();
    } else {
      // If the conversation does not exist, create a new conversation object
      await DirectChats.create({
        conversationId: convoId,
        sharedInfo: [messageId.toString()],
      });
    }

    res.status(200).json({ message: "Message added and conversation updated successfully" });
  } catch (error) {
    console.error("Error during manageDirectChats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default manageDirectChats;