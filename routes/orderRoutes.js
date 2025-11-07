import express from "express";
import Order from "../models/Order.js";
import Retailer from "../models/Retailer.js";

const router = express.Router();

// ✅ Fetch all orders safely
router.get("/", async (req, res) => {
  try {
    // Ensure tables are synced before querying
    await Order.sync();
    await Retailer.sync();

    const orders = await Order.findAll({
      include: [{ model: Retailer, attributes: ["name", "phone", "address"] }],
    });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

export default router;
