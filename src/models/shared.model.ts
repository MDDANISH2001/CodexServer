import { Schema } from "mongoose";
import { IAttachment, IKeys } from "../types/shared.types";

export const keysSchema = new Schema<IKeys>(
  {
    publicKey: { type: String, required: true, unique: true },
    privateKey: {
      iv: { type: String, required: true, unique: true },
      encryptedMessage: { type: String, required: true, unique: true },
      tag: { type: String, required: true, unique: true },
    },
    rootKey: {
      iv: { type: String, required: true, unique: true },
      encryptedMessage: { type: String, required: true, unique: true },
      tag: { type: String, required: true, unique: true },
    },
  },
  {
    timestamps: true,
  }
);

export const attachmentSchema = new Schema<IAttachment>({
  title: { type: String },
  docUrl: { type: String },
});
