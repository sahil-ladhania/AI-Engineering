import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "./error.middleware";
import redis from "../config/redis";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export const authorize = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies["jwt_token"];

  if (!token) {
    const err = new Error("Not authenticated") as AppError;
    err.statusCode = 401;
    return next(err);
  }

  const isBlacklisted = await redis.get(`blacklist:${token}`);
  if (isBlacklisted) {
    const err = new Error("Token has been invalidated, please log in again") as AppError;
    err.statusCode = 401;
    return next(err);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; email: string };
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };
    next();
  } catch (err) {
    next(err);
  }
};
