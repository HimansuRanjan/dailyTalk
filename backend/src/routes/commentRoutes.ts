import express from "express";
import { addCommentToPost, deleteCommentById, getCommentsByPostId } from "../controllers/commentController";
import { isAuthenticated } from "../middleware/auth";


const router = express.Router();

router.post("/add/:id", addCommentToPost);
router.get("/get/all/:id", getCommentsByPostId);
router.delete("/delete/:id",isAuthenticated, deleteCommentById)

export default router;
