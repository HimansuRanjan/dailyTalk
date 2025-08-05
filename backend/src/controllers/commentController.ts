import { NextFunction, Request, Response } from "express";
import prisma from "../models/db";
import { catchAsyncErrors } from "../middleware/catchAsyncError";
import ErrorHandler from "../middleware/error";
import { AuthenticatedRequest } from "../../types/express";

//anyone can comment for now 
export const addCommentToPost = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { text, authorName } = req.body;

    if (!text || !authorName) {
      return next(new ErrorHandler("Text and author name are required", 400));
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return next(new ErrorHandler("Post not found", 404));
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        text,
        authorName,
        postId:id,
      },
    });

    await prisma.post.update({
      where: { id},
      data: {
        comCount: { increment: 1 },
      },
    });

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment,
    });
  }
);

export const getCommentsByPostId = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId  = req.params.id;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return next(new ErrorHandler("Post not found", 404));
    }

    // Fetch all comments for the post, newest first
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      total: comments.length,
      comments,
    });
  }
);

// Only Admin can delete 
export const deleteCommentById = catchAsyncErrors(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Assuming req.user is available via middleware after auth check
    if (!req.user) {
      return next(new ErrorHandler("Only admins can delete comments", 403));
    }

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return next(new ErrorHandler("Comment not found", 404));
    }

    await prisma.post.update({
      where: { id: comment.postId },
      data: {
        comCount: { decrement: 1 },
      },
    });

    await prisma.comment.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  }
);