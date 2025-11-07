import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import db from "./config/db.js";
import orderRoutes from "./routes/orderRoutes.js";


dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("✅ FMCG Backend is running!");
});

import User from "./models/User.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);


db.sync({ alter: true })
  .then(() => console.log("✅ Database connected & tables synced"))
  .catch((err) => console.error("❌ Database connection failed:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // ✅ Safe router listing (prevents 'undefined' crash)
  if (app._router && app._router.stack) {
    console.log("🧭 Registered routes:");
    app._router.stack.forEach((r) => {
      if (r.route && r.route.path) {
        console.log(r.route.path);
      }
    });
  } else {
    console.log("⚠️ No routes registered yet or Express not ready.");
  }
});
