import express from "express";
import admin from "firebase-admin";
import User from "../models/User.js";

const router = express.Router();

// ✅ VERIFY OTP + AUTO REGISTER if new
router.post("/verify", async (req, res) => {
  try {
    const { idToken, name, shopName, address, city, pincode, gst } = req.body;
    if (!idToken)
      return res.status(400).json({ message: "Missing Firebase ID token" });

    // 🔹 Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(idToken);
    const phone = decoded.phone_number;

    if (!phone)
      return res.status(400).json({ message: "Phone number missing in token" });

    // 🔹 Check if user already exists
    let user = await User.findOne({ where: { mobile: phone } });

    if (!user) {
      // 🔹 Create new retailer
      user = await User.create({
        name,
        mobile: phone,
        shopName,
        address,
        city,
        pincode,
        gst,
        password: null, // OTP only
      });
    }

    res.json({
      success: true,
      message: "OTP verified successfully",
      user,
    });
  } catch (error) {
    console.error("OTP verification failed:", error);
    res
      .status(500)
      .json({ message: "OTP verification failed", error: error.message });
  }
});

export default router;
