// server/models/User.js
import { Schema as _Schema, model } from "mongoose";
import { ICalls } from "../types/calls.type";
const Schema = _Schema;

const calls = new Schema<ICalls>(
  {
    callerId: { type: String, required: true },
    recipientId: { type: String, required: true },
    callStatus: { type: String, required: true },
    mediaType: { type: String, required: true },
    callTime: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    roomId: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const DirectChats = model<ICalls>("Calls", calls);

export default DirectChats;
