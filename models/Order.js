import { DataTypes } from "sequelize";
import db from "../config/db.js";
import User from "./User.js";

const Order = db.define("Order", {
  products: {
    type: DataTypes.JSON, // store product list like [{sku:'ABC',qty:10}]
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

Order.belongsTo(User); // Each order belongs to a user

export default Order;
