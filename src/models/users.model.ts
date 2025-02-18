// server/models/User.js
import { Schema as _Schema, model } from "mongoose";
import { IUser } from "../types/registerUser.type";
import { IKeys } from "../types/shared.types";
import { attachmentSchema, keysSchema } from "./shared.model";
const Schema = _Schema;

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 8 },
    phone: { type: Number, required: false, minLength: 10 },
    keys: keysSchema,
    profilePic: { type: String, required: false, default: "" },
    attachments: [attachmentSchema],
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
