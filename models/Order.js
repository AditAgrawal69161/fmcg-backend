import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Order = db.define("Order", {
  products: {
    type: DataTypes.JSON, // e.g. [{ sku: 'ABC', qty: 10 }]
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

export default Order;
