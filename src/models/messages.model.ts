import { model, Schema } from "mongoose";
import { IAllMessages } from "../types/messages.type";
import { attachmentSchema } from "./shared.model";

const allMessages = new Schema<IAllMessages>(
  {
    message: { type: String, default: "", required: true },
    userId: { type: String, required: true },
    taggedMessage: { type: String, required: false, default: ""},
    attachments: [attachmentSchema],
  },
  {
    timestamps: true,
  }
);

const messages = model<IAllMessages>("Messages", allMessages);

export default messages;
