import express from "express";
import Product from "../models/Product.js";


console.log("🧭 Render loaded productRoutes.js (v4) — includes /reset-seed route");



const router = express.Router();

// ✅ Log when this file is actually loaded on Render
console.log("🧭 [productRoutes] Loaded successfully — v3");

// ✅ Test route to confirm routing
router.get("/ping", (req, res) => {
  res.json({ ok: true, route: "/api/products/ping", timestamp: new Date().toISOString() });
});

/**
 * 🧾 GET /api/products
 * Returns all products with proper SKU, name, price, and stock.
 */
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ["id", "sku", "name", "price", "stock"],
    });
    console.log("🧾 Products fetched:", products.length);
    res.json({ products });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

/**
 * 🌱 GET /api/products/reset-seed
 * Deletes all products and re-inserts fresh SKU-enabled test data.
 */
router.get("/reset-seed", async (req, res) => {
  try {
    await Product.destroy({ where: {} });
    console.log("🗑️ Old product data cleared.");

    const seedData = [
      { sku: "SOAP001", name: "Soap", price: 20, stock: 100 },
      { sku: "SHAMP001", name: "Shampoo", price: 80, stock: 50 },
      { sku: "TOOTH001", name: "Toothpaste", price: 40, stock: 70 },
    ];

    await Product.bulkCreate(seedData);
    console.log("🌱 New SKUs seeded successfully.");

    res.json({ message: "Database reset and seeded successfully!", count: seedData.length });
  } catch (error) {
    console.error("❌ Error during reset/seed:", error);
    res.status(500).json({ message: "Failed to reset and seed products" });
  }
});

export default router;
