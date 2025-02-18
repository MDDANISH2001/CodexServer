import { Request, Response } from "express";
import User from "../models/users.model";
import { hashing } from "../utils/hashPswd";
import jwt from "jsonwebtoken";
import { generateRootKey, generateUserKeys } from "../utils/generateKeys";
import encryptMessage from "../utils/encryptMessage";

export const userRegister = async (req: Request, res: Response) => {
  const userInfo = req.body;

  if (!userInfo.email || !userInfo.password || !userInfo.username) {
    res.status(400).json({ message: "Invalid Request" });
    return;
  }

  try {
    const user = await User.findOne({ email: userInfo.email }).exec();

    if (user) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    userInfo.password = hashing.passwordHash(userInfo.password);

    const userKeyPair = await generateUserKeys();

    const userRootKey = await generateRootKey();

    const publicKeyString = Array.from(userKeyPair.publicKey, (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");
    const privateKeyString = Array.from(userKeyPair.privateKey, (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");

    const credential =
      process.env.CREDENTIALS?.slice(0, 6) +
      userInfo.email +
      process.env.CREDENTIALS?.slice(10);

    const slicedCredential1 = credential.slice(0, 32);
    const slicedCredential2 = credential.slice(5, 37);

    const encryptedPrivateKey = encryptMessage(
      privateKeyString,
      slicedCredential1
    );
    const encryptedRootKey = encryptMessage(userRootKey, slicedCredential2);

    userInfo.keys = {
      publicKey: publicKeyString,
      privateKey: encryptedPrivateKey,
      rootKey: encryptedRootKey,
    };

    const userDoc = await User.create(userInfo);

    if (userDoc && userDoc._id) {
      res.status(200).json({ message: "User Registered" });
    } else {
      res.status(400).json({ message: "Problem in Register" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
