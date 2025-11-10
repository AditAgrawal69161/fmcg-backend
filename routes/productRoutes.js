import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

/**
 * 🧾 GET /api/products
 * Returns all products with proper SKU, name, price, and stock.
 */
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ["id", "sku", "name", "price", "stock"],
    });

    console.log("🧾 Products fetched:", products.map((p) => p.toJSON()));
    res.json({ products });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

/**
 * ⚙️ TEMPORARY ROUTE: Reset and seed product data
 * Deletes all old products and inserts fresh sample products with SKUs.
 * Visit this URL ONCE: https://fmcg-backend-a2zx.onrender.com/api/products/reset-seed
 */
router.get("/reset-seed", async (req, res) => {
  try {
    // 🗑️ Delete all existing products
    await Product.destroy({ where: {} });
    console.log("🗑️ Old product data cleared.");

    // 🌱 Insert fresh products with SKUs
    const products = [
      { sku: "SOAP001", name: "Soap", price: 20, stock: 100 },
      { sku: "SHAMP001", name: "Shampoo", price: 80, stock: 50 },
      { sku: "TOOTH001", name: "Toothpaste", price: 40, stock: 70 },
    ];

    await Product.bulkCreate(products);
    console.log("✅ New products with SKUs inserted.");

    res.json({ message: "Database reset and seeded successfully!" });
  } catch (error) {
    console.error("❌ Error during reset/seed:", error);
    res.status(500).json({ message: "Failed to reset and seed products" });
  }
});

export default router;
