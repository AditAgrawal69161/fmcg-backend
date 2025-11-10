import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// ✅ GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({ products });
  } catch (error) {
    console.error("❌ Failed to fetch products:", error);
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
});

// ✅ (Optional) POST - Add a product manually (for testing)
router.post("/", async (req, res) => {
  try {
    const { name, price, stock, category } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price required" });
    }

    const product = await Product.create({
      name,
      price,
      stock: stock || 0,
      category: category || "Misc",
      isDemo: false,
    });

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ message: "Failed to add product", error: error.message });
  }
});

export default router;
