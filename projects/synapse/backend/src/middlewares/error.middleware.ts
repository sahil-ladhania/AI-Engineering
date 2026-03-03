import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { env } from "../config/env";

export interface AppError extends Error {
  statusCode?: number;
}

export const errorMiddleware = ( err: AppError, _req: Request, res: Response, _next: NextFunction ): void => {
  if (env.NODE_ENV === "development") {
    console.error(err.stack);
  };

  // Zod validation error
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.flatten().fieldErrors,
    });
    return;
  };

  // Prisma known request errors
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res.status(409).json({ success: false, message: "Email already in use" });
      return;
    };

    if (err.code === "P2025") {
      res.status(404).json({ success: false, message: "Record not found" });
      return;
    };

    res.status(400).json({ success: false, message: err.message });
    return;
  };

  // JWT errors
  if (err instanceof TokenExpiredError) {
    res.status(401).json({ success: false, message: "Session Expired, Please Log In Again." });
    return;
  }
  if (err instanceof JsonWebTokenError) {
    res.status(401).json({ 
      success: false, 
      message: "Invalid Token." 
    });
    return;
  }

  // Fallback
  const statusCode = err.statusCode ?? 500;
  res.status(statusCode).json({
    success: false,
    message: err.message ?? "Internal server error",
  });
};