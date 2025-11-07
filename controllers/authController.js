import admin from "firebase-admin";
import User from "../models/User.js";
import fs from "fs";

// Initialize Firebase Admin

const firebaseConfig = JSON.parse(process.env.FIREBASE_KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });
}

export default admin;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const verifyFirebaseToken = async (req, res) => {
  const { idToken, name } = req.body;

  try {
    // Verify token from client
    const decoded = await admin.auth().verifyIdToken(idToken);
    const mobile = decoded.phone_number;

    if (!mobile) {
      return res.status(400).json({ error: "No phone number found in token" });
    }

    // Find or create user
    let user = await User.findOne({ where: { mobile } });
    if (!user) {
      user = await User.create({ mobile, name });
    }

    res.json({
      message: "User verified successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
