import { DataTypes } from "sequelize";
import db from "../config/db.js";
import User from "./User.js";
import Retailer from "./Retailer.js"; // ✅ add this line

const Order = db.define("Order", {
  products: {
    type: DataTypes.JSON, // [{sku:'ABC', qty:10}]
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },
});

// ✅ Relationships
Order.belongsTo(User, { foreignKey: "userId", as: "user" });
Order.belongsTo(Retailer, { foreignKey: "retailerId", as: "retailer" });

export default Order;
