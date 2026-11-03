import { Request, Response } from "express";
import GroupChats from "../../models/groupChat.model";
import { generateRootKey, generateUserKeys } from "../../utils/generateKeys";
import encryptMessage from "../../utils/encryptMessage";
import { saveGroupMessage } from "../../utils/messagePersistence";

const manageGroupChats = async (req: Request, res: Response): Promise<void> => {
  const { messageObj, groupDetails } = req.body;
  const { groupId } = req.query;

  try {
    if (groupDetails) {
      // Create a new group
      const newGroup = await GroupChats.create(groupDetails);
      const groupId = newGroup._id;

      const userKeyPair = await generateUserKeys();
      const userRootKey = await generateRootKey();

      const publicKeyString = Array.from(userKeyPair.publicKey, (byte) =>
        byte.toString(16).padStart(2, "0")
      ).join("");
      const privateKeyString = Array.from(userKeyPair.privateKey, (byte) =>
        byte.toString(16).padStart(2, "0")
      ).join("");

      const credential =
        (process.env.CREDENTIALS?.slice(0, 6) || "") +
        groupId +
        process.env.CREDENTIALS?.slice(10);

      const slicedCredential1 = credential.slice(0, 32);
      const slicedCredential2 = credential.slice(5, 37);

      const encPrivateKey = encryptMessage(privateKeyString, slicedCredential1);
      const encRootKey = encryptMessage(userRootKey, slicedCredential2);

      newGroup.keys = {
        publicKey: publicKeyString,
        privateKey: encPrivateKey,
        rootKey: encRootKey,
      };

      await newGroup.save();

      res
        .status(201)
        .json({ message: "Group created successfully", group: newGroup });
    } else if (messageObj && groupId) {
      // Add message to an existing group
      const newMessage = await saveGroupMessage(groupId as string, messageObj);

      res.status(200).json({ message: "Message added to group successfully", data: newMessage });
    } else {
      res.status(400).json({
        message:
          "Invalid Request: Provide either groupDetails or messageObj with groupId",
      });
    }
  } catch (error) {
    console.error("Error during manageGroupChats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default manageGroupChats;
