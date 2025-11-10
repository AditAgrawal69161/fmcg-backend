import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// ✅ Log when routes are loaded
console.log("🧭 [productRoutes] Loaded successfully — production ready");

// ✅ Ping route (for Render uptime checks)
router.get("/ping", (req, res) => {
  res.json({
    ok: true,
    route: "/api/products/ping",
    timestamp: new Date().toISOString(),
  });
});

// 🧾 GET /api/products — Fetch all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ["id", "sku", "name", "price", "stock"],
    });
    console.log(`🧾 Products fetched: ${products.length}`);
    res.json({ products });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// 🌱 Secure /reset-seed route (only active in non-production environments)
router.get("/reset-seed", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    console.warn("🚫 Reset-seed route blocked in production");
    return res.status(403).json({ message: "Access denied in production" });
  }

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

    res.json({
      message: "Database reset and seeded successfully!",
      count: seedData.length,
    });
  } catch (error) {
    console.error("❌ Error during reset/seed:", error);
    res.status(500).json({ message: "Failed to reset and seed products" });
  }
});

export default router;
