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

    // Basic validation
    if (!userId || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    const order = await Order.create({
      UserId: userId,
      products: JSON.stringify(products), // store as JSON string
      totalAmount,
      paymentStatus: paymentMode === "COD" ? "pending" : "paid",
    });

    res.status(201).json({
      success: true,
      message: "✅ Order created successfully",
      order,
    });
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({
      message: "Error creating order",
      error: err.message,
    });
  }
});

export default router;
