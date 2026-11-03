import { Request, Response } from "express";
import { saveDirectMessage } from "../../utils/messagePersistence";

const manageDirectChats = async (req: Request, res: Response): Promise<void> => {
  const { messageObj } = req.body;
  const { convoId } = req.query;

  if (!convoId || !messageObj) {
    res.status(400).json({ message: "Invalid Request!!!" });
    return;
  }

  try {
    const newMessage = await saveDirectMessage(convoId as string, messageObj);
    res.status(200).json({ message: "Message added and conversation updated successfully", data: newMessage });
  } catch (error) {
    console.error("Error during manageDirectChats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default manageDirectChats;