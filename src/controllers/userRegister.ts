import { Request, Response } from "express";
import User from "../models/registerSchema";
import { hashing } from "../utils/hashPswd";
import jwt from "jsonwebtoken";
import { generateRootKey, generateUserKeys } from "../utils/generateKeys";
import encryptMessage from "../utils/encryptMessage";

export const userRegister = async (req: Request, res: Response) => {
  const userInfo = req.body;
  console.log('userInfo :', userInfo);

  if (!userInfo.email || !userInfo.password || !userInfo.username) {
    res.status(400).json({ message: "Invalid Request" });
    return;
  }

  try {
    const user = await User.findOne({ email: userInfo.email }).exec();
    console.log('Existing user check:', user);

    if (user) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    userInfo.password = hashing.passwordHash(userInfo.password);
    console.log('Hashed password:', userInfo.password);

    const userKeyPair = await generateUserKeys();
    console.log('Generated user keys:', userKeyPair);

    const userRootKey = await generateRootKey();
    console.log('Generated root key:', userRootKey);

    const publicKeyString = Array.from(userKeyPair.publicKey, (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");
    console.log('publicKeyString :', publicKeyString);
    const privateKeyString = Array.from(userKeyPair.privateKey, (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");
    console.log('privateKeyString :', privateKeyString);

    const credential =
      process.env.CREDENTIALS?.slice(0, 6) +
      userInfo.email +
      process.env.CREDENTIALS?.slice(10);
    console.log('credential :', credential);

    const slicedCredential1 = credential.slice(0, 32);
    console.log('slicedCredential1 :', slicedCredential1);
    const slicedCredential2 = credential.slice(5, 37);
    console.log('slicedCredential2 :', slicedCredential2);

    const encryptedPrivateKey = encryptMessage(
      privateKeyString,
      slicedCredential1
    );
    console.log('encryptedPrivateKey :', encryptedPrivateKey);
    const encryptedRootKey = encryptMessage(userRootKey, slicedCredential2);
    console.log('encryptedRootKey :', encryptedRootKey);

    userInfo.keys = {
      publicKey: publicKeyString,
      privateKey: encryptedPrivateKey,
      rootKey: encryptedRootKey,
    };
    
    console.log('Final userInfo with keys:', userInfo);
    const userDoc = await User.create(userInfo);
    console.log('Created user document:', userDoc);
    
    if (userDoc && userDoc._id) {
      res.status(200).json({ message: "User Registered" });
    } else {
      res.status(400).json({ message: "Problem in Register" });
    }
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
