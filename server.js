import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";
import db from "./config/db.js";

// 🧩 Models
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import Retailer from "./models/Retailer.js";

// 🧩 Associations
Retailer.hasMany(Order, { foreignKey: "retailer_id", onDelete: "CASCADE" });
Order.belongsTo(Retailer, { foreignKey: "retailer_id" });

// 🛣️ Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import retailerRoutes from "./routes/retailerRoutes.js";

// ⚙️ Optional services
import { scheduleTallySync } from "./services/tallyService.js";

dotenv.config();

// 🧭 Directory setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 Firebase setup using local file (for dev) or env (for Render)
const serviceAccountPath = path.join(__dirname, "firebase-key.json");
try {
  let serviceAccount;
  if (fs.existsSync(serviceAccountPath)) {
    serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
    console.log("✅ Loaded firebase-key.json from local file");
  } else if (process.env.FIREBASE_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_KEY);
    console.log("✅ Loaded Firebase key from environment variable");
  }

  if (serviceAccount && !admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("🔥 Firebase Admin initialized successfully");
  }
} catch (err) {
  console.warn("⚠️ Firebase initialization failed:", err.message);
}

// 🚀 Express app setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("✅ FMCG Backend is running fine on Render!");
});

// ✅ Register routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/retailers", retailerRoutes);

console.log("✅ Mounted all API routes successfully");

// 🗄️ Sync DB and Start Server
  db.sync({ alter: true, force: true })
  .then(async () => {
    console.log("✅ Database connected & tables synced (alter:true)");

    try {
      scheduleTallySync();
      console.log("🔄 Tally SKU auto-sync scheduled");
    } catch (err) {
      console.warn("⚠️ Could not start Tally sync:", err.message);
    }

    const PORT = process.env.PORT || 10000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ Database connection failed:", err));
