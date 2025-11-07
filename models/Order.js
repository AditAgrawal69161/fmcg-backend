import { DataTypes } from "sequelize";
import db from "../config/db.js";
import User from "./User.js"; // keep this — Firebase users are stored here if applicable
import Retailer from "./Retailer.js"; // newly added retailer model

const Order = db.define("Order", {
  products: {
    type: DataTypes.JSON, // store product list like [{sku:'ABC',qty:10}]
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: "COD", // Cash on Delivery by default
  },
  paymentStatus: {
    type: DataTypes.STRING,
    defaultValue: "Pending",
  },
  orderStatus: {
    type: DataTypes.STRING,
    defaultValue: "Placed",
  },
  deliveryAddress: {
    type: DataTypes.STRING,
  },
});

// Relationships
Order.belongsTo(User, { foreignKey: "userId" }); // link with Firebase-auth user
Order.belongsTo(Retailer, { foreignKey: "retailerId" }); // link with retailer info

export default Order;
