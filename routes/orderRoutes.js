import express from "express";
import Order from "../models/Order.js";
import Retailer from "../models/Retailer.js";

const router = express.Router();

// Place new order
router.post("/", async (req, res) => {
  try {
    const { retailerId, items, totalAmount } = req.body;

    if (!retailerId || !items || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = await Order.create({
      retailerId,
      items,
      totalAmount,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      orderStatus: "Placed",
    });

    res.json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error placing order" });
  }
});

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.findAll({ include: Retailer });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

export default router;
