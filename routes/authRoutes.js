import express from "express";
import admin from "firebase-admin";
import Retailer from "../models/Retailer.js";

const router = express.Router();

// ✅ Verify Firebase OTP + Auto-register retailer
router.post("/verify", async (req, res) => {
  try {
    const { idToken, name, shopName, address, city, pincode, gst } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Missing Firebase ID token" });
    }

    // Verify token with Firebase
    const decoded = await admin.auth().verifyIdToken(idToken);
    const phone = decoded.phone_number;
    const firebase_uid = decoded.uid;

    if (!phone) {
      return res.status(400).json({ message: "Phone number missing in token" });
    }

    // Check if retailer already exists
    let retailer = await Retailer.findOne({ where: { phone } });

    // If new retailer, create record
    if (!retailer) {
      retailer = await Retailer.create({
        firebase_uid,
        name: name || "",
        shopName: shopName || "",
        phone,
        address: address || "",
        city: city || "",
        pincode: pincode || "",
        gst: gst || null,
        password: null, // ✅ allowed
      });
    }

    return res.json({
      success: true,
      message: "OTP verified successfully",
      retailer,
    });
  } catch (error) {
    console.error("OTP verification failed:", error);
    return res.status(500).json({
      message: "OTP verification failed",
      error: error.message,
    });
  }
});

export default router;
