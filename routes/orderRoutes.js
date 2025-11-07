import express from "express";
import Order from "../models/Order.js";
import Retailer from "../models/Retailer.js"; // ← important line

const router = express.Router();

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
