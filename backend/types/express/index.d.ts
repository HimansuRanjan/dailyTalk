import { user } from "@prisma/client";
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: user;
}

export interface userType{
  id: string;
  username: string;  
  email: string;
  avatarId:  string | null;
  avatarUrl: string| null;
  aboutMe:    string| null;
  password: string;
}