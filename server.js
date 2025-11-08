import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import db from "./config/db.js";

import User from "./models/User.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
// NOTE: No Retailer import yet

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

import admin from "firebase-admin";
import serviceAccount from "./firebase-key.json" assert { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}


const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("✅ FMCG Backend is running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

db.sync({ alter: true })
  .then(() => console.log("✅ Database connected & tables synced"))
  .catch((err) => console.error("❌ Database connection failed:", err));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
