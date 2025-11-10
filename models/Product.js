import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Product = db.define("Product", {
  sku: {
  type: DataTypes.STRING,
  allowNull: false,
  // ⚠️ Don't include "unique" directly here — it causes ALTER syntax errors in Postgres
  comment: "Unique product SKU identifier",
},

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isDemo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});


Product.addHook("afterSync", async () => {
  try {
    // Ensure SKU has a unique constraint in DB (avoids Sequelize ALTER conflicts)
    await db.query('ALTER TABLE "Products" ADD CONSTRAINT IF NOT EXISTS "products_sku_unique" UNIQUE ("sku");');
    console.log("✅ Ensured SKU unique constraint in DB");
  } catch (err) {
    console.warn("⚠️ Could not set SKU unique constraint:", err.message);
  }
});


export default Product;
