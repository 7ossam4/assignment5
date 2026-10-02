import { Post, User, Comment } from "../../DB/models/index.js";
import { sequelize } from "../../DB/connection.js";

const handleError = (res, err) => {
  if (err.name === "SequelizeValidationError" || err.name?.startsWith("SequelizeForeignKey")) {
    return res.status(400).json({ message: err.message });
  }
  return res.status(500).json({ message: "Server error", error: err.message });
};

export const createPost = async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    const post = new Post({ title, content, userId });
    await post.save();
    return res.status(201).json({ message: "Post created successfully." });
  } catch (err) {
    return handleError(res, err);
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    if (post.userId !== Number(req.body.userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post." });
    }

    await post.destroy(); 
    return res.status(200).json({ message: "Post deleted." });
  } catch (err) {
    return handleError(res, err);
  }
};

export const getPostsWithDetails = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ["id", "title"],
      include: [
        { model: User, attributes: ["id", "name"] },
        { model: Comment, attributes: ["id", "content"] },
      ],
    });
    return res.status(200).json(posts);
  } catch (err) {
    return handleError(res, err);
  }
};

export const getPostsWithCommentCount = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: [
        "id",
        "title",
        [
          sequelize.literal(
            "(SELECT COUNT(*) FROM comments WHERE comments.postId = `Post`.`id`)"
          ),
          "commentCount",
        ],
      ],
    });
    return res.status(200).json(posts);
  } catch (err) {
    return handleError(res, err);
  }
};
