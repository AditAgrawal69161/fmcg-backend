// routes/orderRoutes.js
import express from "express";
import admin from "../config/firebaseAdmin.js";
import { placeOrder, getOrdersByRetailer } from "../controllers/orderController.js";
import Retailer from "../models/Retailer.js";

const router = express.Router();

/**
 * 🛒 POST /api/orders/place
 * Places a new order for the authenticated retailer
 */
router.post("/place", async (req, res) => {
  try {
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) {
      return res.status(401).json({ message: "Missing or invalid token" });
    }

    // ✅ Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    // ✅ Find retailer by Firebase UID
    const retailer = await Retailer.findOne({ where: { firebase_uid: uid } });
    if (!retailer) {
      return res.status(404).json({ message: "Retailer not found. Please register first." });
    }

    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid order format: items must be an array" });
    }

    // ✅ Call controller function
    const order = await placeOrder({ user: { id: retailer.id }, body: { items } }, res);

    if (!res.headersSent) {
      return res.status(201).json({
        message: "Order placed successfully",
        order,
      });
    }
  } catch (err) {
    console.error("❌ Error placing order:", err);
    if (!res.headersSent)
      return res.status(500).json({ message: `Internal Server Error: ${err.message}` });
  }
});

/**
 * 🧾 GET /api/orders/myorders
 * Fetch all past orders for logged-in retailer
 */
router.get("/myorders", async (req, res) => {
  try {
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) {
      return res.status(401).json({ message: "Missing or invalid token" });
    }

    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const retailer = await Retailer.findOne({ where: { firebase_uid: uid } });
    if (!retailer) {
      return res.status(404).json({ message: "Retailer not found." });
    }

    // ✅ Fetch orders from controller
    const orders = await getOrdersByRetailer({ user: { id: retailer.id } }, res);

    if (!res.headersSent) return res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    if (!res.headersSent)
      return res.status(500).json({ message: `Internal Server Error: ${err.message}` });
  }
});

export default router;
