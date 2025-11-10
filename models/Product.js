import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Product = db.define("Product", {
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

export default Product;
