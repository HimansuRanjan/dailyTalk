import { user } from "@prisma/client";
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: user;
}
