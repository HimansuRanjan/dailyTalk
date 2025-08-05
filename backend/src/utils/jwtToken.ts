import { Response } from "express";
import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";

// Generate JWT token
const createJwtToken = (userId: string): string => {
    
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: '10d',
  });
};

// Main token function
export const generateToken = (
  userId: string,
  message: string,
  statusCode: number,
  res: Response
): void => {
  const token = createJwtToken(userId);

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(
        Date.now() +
          (Number(process.env.COOKIE_EXPIRES || 7) * 24 * 60 * 60 * 1000)
      ),
      httpOnly: true,
      sameSite: "none",
      secure: true, // only works on HTTPS
    })
    .json({
      success: true,
      message,
      token,
      userId,
    });
};
