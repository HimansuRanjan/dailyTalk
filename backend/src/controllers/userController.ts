import { Request, Response, NextFunction } from "express";
import prisma from "../models/db";
import { catchAsyncErrors } from "../middleware/catchAsyncError";
import { v2 as cloudinary } from "cloudinary";
import { UploadedFile } from "express-fileupload";
import ErrorHandler from "../middleware/error";
import { generateToken } from "../utils/jwtToken";
import bcrypt from "bcrypt";
import { AuthenticatedRequest } from "../../types/express";
import { generateResetToken } from "../utils/generateResetToken";
import { sendEmail } from "../utils/sendEmail";
import crypto from "crypto";



export const registerUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, email, password, confirmPassword} = req.body;
    
    console.log("in side Signup");

    if (!username || !email || !password || !confirmPassword) {
        return next(new ErrorHandler("Please Fill all Fields to sign up!", 400));
    }
   
    if(password !== confirmPassword){
        return next(new ErrorHandler("Password and Confirm Password must be matched!", 400));
    }

     // 🔐 Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is salt rounds

    
    // Save user to database with following data
    const user = await prisma.user.create({
        data: {
        username,
        email,
        password: hashedPassword,
        },
    });

    // 8. Send token
    generateToken(user.id, "User Registered", 201, res);
  }
);

export const loginUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide both email and password", 400));
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Send token
    generateToken(user.id, "Login successful", 200, res);
  }
);

export const updateProfile = catchAsyncErrors(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const { username, email, aboutMe } = req.body;

    const newUserData: {
      username?: string;
      email?: string;
      aboutMe?: string;
      avatarId?: string;
      avatarUrl?: string;
    } = {
      username,
      email,
      aboutMe,
    };

    // Fetch current user
    const existingUser = await prisma.user.findUnique({
      where: { id: req.user?.id },
    });

    if (!existingUser) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Handle avatar update
    if (req.files && req.files.avatar) {
      const avatar = req.files.avatar as UploadedFile;

      // Delete existing avatar from Cloudinary
      if (existingUser.avatarId) {
        await cloudinary.uploader.destroy(existingUser.avatarId);
      }

      // Upload new avatar
      const uploadResult = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        { folder: "AVATARS" }
      );

      newUserData.avatarId = uploadResult.public_id;
      newUserData.avatarUrl = uploadResult.secure_url;
    }

    // Update user in DB
    const updatedUser = await prisma.user.update({
      where: { id: req.user?.id },
      data: newUserData,
    });

    res.status(200).json({
      success: true,
      message: "Profile Updated!",
      user: updatedUser,
    });
  }
);

export const logoutUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .json({
      success: true,
      message: "Logged Out!",
    });
  }
);

export const getUser = catchAsyncErrors(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    res.status(200).json({
    success: true,
    user: req.user
  });
  }
);

export const changePassword = catchAsyncErrors(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return next(new ErrorHandler("Please fill all fields", 400));
    }

    if (newPassword !== confirmNewPassword) {
      return next(
        new ErrorHandler("New Password and Confirm Password must match!", 400)
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user || !user.password) {
      return next(new ErrorHandler("User not found or password missing!", 404));
    }

    const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Incorrect current password!", 401));
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({
      success: true,
      message: "Password updated!",
    });
  }
);

export const forgotPassword = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return next(new ErrorHandler("User Not Found! Please provide a valid Email", 404));
  }

  const { resetToken, hashedToken, expireTime } = generateResetToken();

  await prisma.user.update({
    where: { email },
    data: {
      resetPasswordToken: hashedToken,
      resetPasswordExpire: expireTime,
    },
  });

  const resetPasswordUrl = `${process.env.APP_URL}/reset/password/${resetToken}`;
  const message = `Your Reset Password URL is:\n\n${resetPasswordUrl}\n\nIf you did not request this, please ignore.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully!`,
    });
  } catch (error: any) {
    // Rollback reset data
    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: null,
        resetPasswordExpire: null,
      },
    });
    return next(new ErrorHandler(error.message, 500));
  }
});

export const resetPassword = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password & Confirm Password must match!", 400));
  }

  // console.log(token);

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpire: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return next(new ErrorHandler("Reset token is invalid or has expired", 400));
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpire: null,
    },
  });

  // Optionally re-login
  generateToken(user.id, "Password Reset Successfully!", 200, res);
});
