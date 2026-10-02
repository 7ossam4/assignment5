import { Router } from "express";
import * as postService from "./post.service.js";

const router = Router();

router.post("/", postService.createPost);
router.get("/details", postService.getPostsWithDetails);
router.get("/comment-count", postService.getPostsWithCommentCount);
router.delete("/:postId", postService.deletePost);

export default router;
