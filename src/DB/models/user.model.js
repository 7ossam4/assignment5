import { DataTypes, ValidationError } from "sequelize";
import { sequelize } from "../connection.js";

const checkNameLength = (name) => {
  if (!name || name.length <= 2) {
    throw new ValidationError("Name must be greater than 2 characters.");
  }
};

export const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: { msg: "Invalid email format." } }, 
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkPasswordLength(value) {
          if (!value || value.length <= 6) {
            throw new Error("Password must be greater than 6 characters.");
          }
        },
      },
    },
    role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
  },
  {
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeCreate: (user) => {
        checkNameLength(user.name);
      },
    },
  }
);
