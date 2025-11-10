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
      allowNull: true, // ✅ some users may not have Firebase UID
      unique: true, // one retailer per Firebase UID
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
      unique: true, // one retailer per phone number
    },
    address: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    pincode: {
      type: DataTypes.STRING,
    },
    gst: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, // ✅ make password optional for OTP login
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

export default Retailer;
