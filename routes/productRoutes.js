import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// ✅ GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ["id", "sku", "name", "price", "stock", "category", "isDemo"],
      order: [["id", "ASC"]],
    });

    res.json({ products });
  } catch (error) {
    console.error("❌ Failed to fetch products:", error);
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
});

export default router;
