import express from "express";
import { sequelize } from "./DB/connection.js";
import "./DB/models/index.js";
import userRouter from "./modules/users/user.controller.js";
import postRouter from "./modules/posts/post.controller.js";
import commentRouter from "./modules/comments/comment.controller.js";

const bootstrap = async () => {
  const app = express();
  const port = 3000;

  app.use(express.json());

  app.use(["/users", "/user"], userRouter);
  app.use("/posts", postRouter);
  app.use("/comments", commentRouter);

  app.use((req, res) => res.status(404).json({ message: "Route not found." }));

  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("DB connected & synced");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error("DB connection failed:", err.message);
  }
};

export default bootstrap;
