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

export const register = async (req, res) => {
  try {
    const { name, mobile, password, shopName, address, city, pincode } = req.body;

    if (!name || !mobile || !password)
      return res.status(400).json({ message: "Missing required fields" });

    const existingUser = await User.findOne({ where: { mobile } });
    if (existingUser)
      return res.status(400).json({ message: "Mobile number already registered" });

    const user = await User.create({
      name,
      mobile,
      password,
      shopName,
      address,
      city,
      pincode,
    });

    res.status(201).json({
      success: true,
      user,
      message: "Retailer registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
