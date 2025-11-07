import { DataTypes } from "sequelize";
import db from "../config/db.js";

const User = db.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

export default User;
