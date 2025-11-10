import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Order = db.define("Order", {
  retailer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "Foreign key: Retailer who placed the order",
  },
  products: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: "Array of ordered products with quantities and prices",
  },
  total_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: "Total value of the order",
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pending",
    comment: "Order status: pending, completed, or cancelled",
  },
});

export default Order;
