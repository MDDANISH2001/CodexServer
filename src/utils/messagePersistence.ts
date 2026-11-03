import DirectChats from "../models/directChat.model";
import GroupChat from "../models/groupChat.model";
import Messages from "../models/messages.model";

export const saveDirectMessage = async (convoId: string, messageObj: any) => {
  const newMessage = await Messages.create(messageObj);
  const messageId = newMessage._id.toString();

  const conversation = await DirectChats.findOne({ conversationId: convoId }).exec();

  if (conversation) {
    conversation.sharedInfo.push(messageId);
    await conversation.save();
  } else {
    await DirectChats.create({
      conversationId: convoId,
      sharedInfo: [messageId],
    });
  }

  return newMessage;
};

export const saveGroupMessage = async (groupId: string, messageObj: any) => {
  const newMessage = await Messages.create(messageObj);
  const messageId = newMessage._id.toString();

  const group = await GroupChat.findById(groupId).exec();
  if (!group) {
    throw new Error("Group not found");
  }

  group.messages.push(messageId);
  await group.save();

  return newMessage;
};
