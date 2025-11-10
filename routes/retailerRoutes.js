import express from "express";
import admin from "../config/firebaseAdmin.js";
import Retailer from "../models/Retailer.js";

const router = express.Router();

/**
 * ✅ GET /api/retailers/check/:uid
 * Checks if retailer exists in the MySQL database for a given Firebase UID
 */
router.get("/check/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    if (!uid) return res.status(400).json({ message: "UID is required" });

    const retailer = await Retailer.findOne({ where: { firebase_uid: uid } });
    if (!retailer) {
      return res.status(404).json({ exists: false, message: "Retailer not found" });
    }

    res.status(200).json({
      exists: true,
      message: "Retailer exists",
      retailer,
    });
  } catch (err) {
    console.error("❌ Error checking retailer:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * ✅ POST /api/retailers/register
 * Registers a new retailer after verifying Firebase ID token
 */
router.post("/register", async (req, res) => {
  try {
    console.log("📥 Incoming registration request...");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);

    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) return res.status(401).json({ message: "Missing token" });

    // 🔒 Verify Firebase ID token
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;
    console.log("✅ Firebase UID verified:", uid);

    const { name, shopName, phone, address, city, pincode } = req.body;
    if (!name || !shopName || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🧠 Check if retailer already exists
    const existing = await Retailer.findOne({ where: { firebase_uid: uid } });
    if (existing) {
      console.log("🟡 Retailer already exists:", existing.dataValues);
      return res.status(200).json({
        message: "Retailer already registered",
        retailer: existing,
      });
    }

    // ✅ Create new retailer
    const newRetailer = await Retailer.create({
      firebase_uid: uid,
      name,
      shopName,
      phone,
      address,
      city,
      pincode,
    });

    console.log("✅ Retailer registered successfully:", newRetailer.dataValues);
    return res.status(200).json({
      message: "Retailer registered successfully",
      retailer: newRetailer,
    });
  } catch (err) {
    console.error("❌ Error registering retailer:", err);
    res.status(500).json({ message: `Error registering retailer: ${err.message}` });
  }
});

export default router;
