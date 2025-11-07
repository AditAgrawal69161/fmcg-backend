import express from "express";
const router = express.Router();

// ✅ Debug log to confirm load
console.log("🧩 productRoutes.js loaded successfully!");

// Test route
router.get("/test", (req, res) => {
  res.send("✅ Product route working!");
});

// Example GET route for all products
router.get("/", (req, res) => {
  res.json({
    products: [
      { name: "Soap", price: 20, stock: 100 },
      { name: "Shampoo", price: 80, stock: 50 },
      { name: "Toothpaste", price: 40, stock: 70 }
    ]
  });
});


export default router;
