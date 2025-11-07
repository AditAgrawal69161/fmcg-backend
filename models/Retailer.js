import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Retailer = db.define("Retailer", {
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  shopName: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  firebaseUid: { type: DataTypes.STRING, unique: true },
});

export default Retailer;
