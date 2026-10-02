import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection.js";

export class Comment extends Model {}

Comment.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "posts", key: "id" },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
  },
  {
    sequelize,
    modelName: "Comment",
    tableName: "comments",
    timestamps: true,
  }
);
