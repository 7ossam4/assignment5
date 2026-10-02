import { Op } from "sequelize";
import { Comment, User, Post } from "../../DB/models/index.js";

const handleError = (res, err) => {
  if (err.name === "SequelizeValidationError" || err.name?.startsWith("SequelizeForeignKey")) {
    return res.status(400).json({ message: err.message });
  }
  return res.status(500).json({ message: "Server error", error: err.message });
};

export const createBulkComments = async (req, res) => {
  try {
    const { comments } = req.body;
    if (!Array.isArray(comments) || comments.length === 0) {
      return res.status(400).json({ message: "comments array is required." });
    }
    await Comment.bulkCreate(comments, { validate: true });
    return res.status(201).json({ message: "comments created." });
  } catch (err) {
    return handleError(res, err);
  }
};

export const updateComment = async (req, res) => {
  try {
    const { userId, content } = req.body;
    const comment = await Comment.findByPk(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "comment not found" });

    if (comment.userId !== Number(userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this comment." });
    }

    comment.content = content;
    await comment.save();
    return res.status(200).json({ message: "Comment updated." });
  } catch (err) {
    return handleError(res, err);
  }
};

export const findOrCreateComment = async (req, res) => {
  try {
    const { postId, userId, content } = req.body;
    const [comment, created] = await Comment.findOrCreate({
      where: { postId, userId, content },
    });
    return res.status(created ? 201 : 200).json({ comment, created });
  } catch (err) {
    return handleError(res, err);
  }
};

export const searchComments = async (req, res) => {
  try {
    const { word } = req.query;
    const { count, rows } = await Comment.findAndCountAll({
      where: { content: { [Op.like]: `%${word}%` } },
    });
    if (count === 0) return res.status(404).json({ message: "no comments found." });
    return res.status(200).json({ count, comments: rows });
  } catch (err) {
    return handleError(res, err);
  }
};

export const getNewestComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.postId },
      order: [["createdAt", "DESC"]],
      limit: 3,
      attributes: ["id", "content", "createdAt"],
    });
    return res.status(200).json(comments);
  } catch (err) {
    return handleError(res, err);
  }
};

export const getCommentDetails = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      attributes: ["id", "content"],
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: Post, attributes: ["id", "title", "content"] },
      ],
    });
    if (!comment) return res.status(404).json({ message: "no comment found" });
    return res.status(200).json(comment);
  } catch (err) {
    return handleError(res, err);
  }
};
