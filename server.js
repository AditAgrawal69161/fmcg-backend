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

// 🔥 Firebase setup
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
  console.warn("⚠️ firebase-key.json not found — Firebase features disabled");
}

// 🚀 Express app setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("✅ FMCG Backend v3 is running fine!");
});

// ✅ Register routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

console.log("✅ Mounted /api/products routes successfully");


app.use("/api/orders", orderRoutes);
app.use("/api/retailers", retailerRoutes);

// 🌱 Seed default products only once if DB is empty
async function seedProducts() {
  const count = await Product.count();
  if (count === 0) {
    await Product.bulkCreate([
      { sku: "SOAP001", name: "Soap", price: 20, stock: 100 },
      { sku: "SHAMP001", name: "Shampoo", price: 80, stock: 50 },
      { sku: "TOOTH001", name: "Toothpaste", price: 40, stock: 70 },
    ]);
    console.log("🟢 Seeded default products into DB");
  } else {
    console.log(`ℹ️ Products already exist (${count})`);
  }
}

// 🗄️ Sync DB and Start Server
db.sync({ alter: true, force: false }) // ⚠️ allow schema updates once
  .then(async () => {
    console.log("✅ Database connected & tables synced (alter:true)");

    await seedProducts();

    try {
      scheduleTallySync();
      console.log("🔄 Tally SKU auto-sync scheduled");
    } catch (err) {
      console.warn("⚠️ Could not start Tally sync:", err.message);
    }

    const PORT = process.env.PORT || 10000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ Database connection failed:", err));
