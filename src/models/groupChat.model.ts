import { model, Schema } from "mongoose";
import { IGroupChat, IGroupUsers, ILeftUsers } from "../types/groupChat.type";
import { keysSchema } from "./shared.model";

const groupUsers = new Schema<IGroupUsers>(
  {
    userId: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const leftUsers = new Schema<ILeftUsers>(
  {
    userId: { type: String },
    groupDeleted: { type: Boolean, default: false }, //to check whether the user have deleted the group from its chats or not.
  },
  {
    timestamps: true,
  }
);

const groupChat = new Schema<IGroupChat>(
  {
    groupName: { type: String, required: true },
    keys: keysSchema,
    activeUsers: [groupUsers],
    inactiveUsers: [leftUsers],
    messages: [String],
    groupProfile: { type: String },
  },
  {
    timestamps: true,
  }
);

const groupChats = model<IGroupChat>("GroupChat", groupChat);

export default groupChats;
