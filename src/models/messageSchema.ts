import { model, Schema } from "mongoose";
import { IAllMessages } from "../types/messages.type";
import { attachmentSchema } from "./sharedShema";

const allMessages = new Schema<IAllMessages>(
  {
    message: { type: String, default: "", required: true },
    userId: { type: String, required: true },
    attachments: [attachmentSchema],
  },
  {
    timestamps: true,
  }
);

export const messages = model<IAllMessages>("Messages", allMessages);
