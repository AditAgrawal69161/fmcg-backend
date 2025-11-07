import express from "express";
import Order from "../models/Order.js";
import Retailer from "../models/Retailer.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: Retailer,
          as: "retailer",
          attributes: ["name", "phone", "address"],
        },
      ],
    });
    res.json(orders);
  } catch (error) {
    console.error("❌ Sequelize error:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

export default router;
