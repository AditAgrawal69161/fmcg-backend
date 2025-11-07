import express from "express";
import Order from "../models/Order.js";
import db from "../config/db.js";

const router = express.Router();

// 1) Health: check DB is reachable + list tables
router.get("/health", async (req, res) => {
  try {
    await db.authenticate();
    const [tables] = await db.query(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
    );
    res.json({ ok: true, tables });
  } catch (e) {
    console.error("HEALTH_ERROR:", e);
    res.status(500).json({ ok: false, error: e.message, stack: e.stack });
  }
});

// 2) List orders (no include / associations)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [["createdAt", "DESC"]],
      raw: true,
    });
    res.json(orders);
  } catch (e) {
    console.error("ORDER_LIST_ERROR:", e);
    res.status(500).json({ message: "Order list failed", error: e.message });
  }
});

// 3) Seed one order quickly to test
router.post("/seed", async (req, res) => {
  try {
    const seeded = await Order.create({
      products: [{ sku: "SOAP", qty: 2 }, { sku: "SHAMPOO", qty: 1 }],
      totalAmount: 120,
      paymentStatus: "pending",
    });
    res.json(seeded);
  } catch (e) {
    console.error("SEED_ERROR:", e);
    res.status(500).json({ message: "Seed failed", error: e.message });
  }
});

export default router;
