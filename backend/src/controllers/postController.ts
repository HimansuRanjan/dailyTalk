import { NextFunction, Request, Response } from "express";
import prisma from "../models/db";
import { catchAsyncErrors } from "../middleware/catchAsyncError";
import { AuthenticatedRequest } from "../../types/express";
import ErrorHandler from "../middleware/error";

export const createPost = catchAsyncErrors(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { title, content } = req.body;
    const authorId = req.user?.id; // assume middleware sets req.user

    if (!title || !content || !Array.isArray(content)) {
      // return res.status(400).json({ message: "Invalid post data" });
      return new ErrorHandler("Invalid Post Data", 400);
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
        likes: 0,
        comCount: 0,
      },
    });

    res.status(201).json({ 
      message: "Post created", 
      post: newPost 
    });
  }
);

export const getAllPosts = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc", // Latest to oldest
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        comments: true,
      },
    });

    res.status(200).json({
      success: true,
      posts,
    });
  }
);

export const getPostById = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            avatarUrl: true,
          },
        },
        comments:{
          orderBy: {
            createdAt: "desc"
          },
          select: {
            id: true,
            text: true,
            createdAt: true,
            authorName: true,
          }
        } 
      },
    });

    if (!post) {
      return next(new ErrorHandler("Post not found", 404));
    }

    res.status(200).json({
      success: true,
      post,
    });
  }
);

// Only done By Admin
export const updatePost = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, content } = req.body;

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return next(new ErrorHandler("Post not found", 404));
    }

    if (content && !Array.isArray(content)) {
      return next(new ErrorHandler("Invalid content format. Must be an array of blocks.", 400));
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: title ?? existingPost.title,
        content: content ?? existingPost.content,
      },
    });

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  }
);

export const deletePost = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return next(new ErrorHandler("Post not found", 404));
    }

    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  }
);

//Anyone can like
export const likePostById = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return next(new ErrorHandler("Post not found", 404));
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        likes: { increment: 1 },
      },
    });

    res.status(200).json({
      success: true,
      message: "Post liked successfully",
      likes: updatedPost.likes,
    });
  }
);
