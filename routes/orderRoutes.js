import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Test route for sanity check
router.get("/test", (req, res) => {
  res.json({ message: "Order route working ✅" });
});

// ✅ Fetch all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: { model: User, attributes: ["id", "name", "email"] },
    });
    res.json({ success: true, orders });
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
});

// ✅ Create new order
router.post("/", async (req, res) => {
  try {
    const { userId, products, totalAmount, paymentMode } = req.body;

    if (!userId || !products || !totalAmount)
      return res.status(400).json({ message: "Missing required fields" });

    const order = await Order.create({
      UserId: userId,
      products,
      totalAmount,
      paymentStatus: paymentMode === "COD" ? "pending" : "paid",
    });

    // 🧾 Log order details in Render logs
    console.log("🆕 New Order Received:");
    console.log(`👤 User ID: ${userId}`);
    console.log(`🛒 Products: ${JSON.stringify(products)}`);
    console.log(`💰 Total: ₹${totalAmount}`);
    console.log(`💳 Payment: ${paymentMode}`);

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("❌ Error creating order:", err.message);
    res.status(500).json({ message: "Error creating order", error: err.message });
  }
});


export default router;
