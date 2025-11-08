import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import db from "./config/db.js";

// 🧩 Sequelize models
import User from "./models/User.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";

// 🧩 Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// 🔐 Firebase Admin SDK
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// ✅ Fix "__dirname" for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load Firebase service account safely (no assert syntax)
const serviceAccountPath = path.join(__dirname, "firebase-key.json");
if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("🔥 Firebase Admin initialized");
  }
} else {
  console.warn("⚠️ firebase-key.json not found! Firebase features will be disabled.");
}

const app = express();

// 🧰 Middleware
app.use(cors());
app.use(bodyParser.json());

// 🏁 Default route
app.get("/", (req, res) => {
  res.send("✅ FMCG Backend is running!");
});

// 🛣️ API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// 🗄️ Sync database
db.sync({ alter: true })
  .then(() => console.log("✅ Database connected & tables synced"))
  .catch((err) => console.error("❌ Database connection failed:", err));

// 🚀 Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
