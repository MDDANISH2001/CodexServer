// server/models/User.js
import { Schema as _Schema, model } from "mongoose";
import { IDirectChat } from "../types/directChat.type";
const Schema = _Schema;

const directChat = new Schema<IDirectChat>(
  {
    conversationId: { type: String, required: true },
    sharedInfo: [String],
  },
  {
    timestamps: true,
  }
);

const DirectChats = model<IDirectChat>("DirectChats", directChat);

export default DirectChats;
