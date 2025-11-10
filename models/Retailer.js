import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Retailer = db.define(
  "Retailer",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firebase_uid: {
      type: DataTypes.STRING,
      allowNull: true, // Firebase UID from decoded token
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shopName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // unique per phone number
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gst: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // ✅ Password optional (since OTP only)
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

export default Retailer;
