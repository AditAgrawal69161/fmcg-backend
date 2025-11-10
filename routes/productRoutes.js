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

// ⚙️ TEMPORARY: Seed products with SKU
router.get("/seed", async (req, res) => {
  try {
    const products = [
      { sku: "SOAP001", name: "Soap", price: 20, stock: 100 },
      { sku: "SHAMP001", name: "Shampoo", price: 80, stock: 50 },
      { sku: "TOOTH001", name: "Toothpaste", price: 40, stock: 70 },
    ];

    await Product.bulkCreate(products, { ignoreDuplicates: true });

    res.json({ message: "✅ Products seeded successfully!" });
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    res.status(500).json({ message: "Failed to seed products" });
  }
});


export default router;
