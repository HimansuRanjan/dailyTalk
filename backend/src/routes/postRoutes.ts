import express from "express";
import { createPost, deletePost, getAllPosts, getPostById, likePostById, updatePost } from "../controllers/postController";
import { isAuthenticated } from "../middleware/auth";
import { deleteCommentById } from "../controllers/commentController";

const router = express.Router();

router.post("/create", isAuthenticated, createPost);
router.get("/get/all", getAllPosts);
router.get("/get/:id", getPostById);
router.put("/update/:id", isAuthenticated, updatePost);
router.delete("/delete/:id", isAuthenticated, deletePost);
router.put("/like/:id", likePostById);

export default router;
