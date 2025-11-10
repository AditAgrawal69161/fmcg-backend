import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

/**
 * ✅ GET /api/products
 * Returns all products with proper SKU, name, price, and stock.
 */
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ["id", "sku", "name", "price", "stock"],
    });

    console.log("🟢 Products fetched:", products.map(p => p.toJSON()));
    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

export default router;
