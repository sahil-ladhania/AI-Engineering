import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
}

export const errorMiddleware = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // 1. Determine the HTTP status code:
  //    - Use err.statusCode if present
  //    - Fall back to 500 for any unhandled/unknown error
  //
  // 2. Handle Zod validation errors (ZodError):
  //    - Check if err is an instance of ZodError
  //    - Flatten the issues: err.flatten().fieldErrors
  //    - Override statusCode to 400
  //    - Return { success: false, message: "Validation error", errors: fieldErrors }
  //
  // 3. Handle Prisma known request errors (PrismaClientKnownRequestError):
  //    - Check err.code:
  //      - "P2002" (unique constraint violation) → 409 "Already exists"
  //      - "P2025" (record not found)            → 404 "Not found"
  //      - Any other Prisma code                 → 400 with err.message
  //
  // 4. Handle JWT errors:
  //    - JsonWebTokenError  → 401 "Invalid token"
  //    - TokenExpiredError  → 401 "Token expired"
  //
  // 5. In development: log the full error stack to console for debugging
  //    if (NODE_ENV === "development") console.error(err.stack)
  //
  // 6. Return the final JSON response:
  //    res.status(statusCode).json({ success: false, message: err.message })
  const statusCode = err.statusCode ?? 500;
  res.status(statusCode).json({
    success: false,
    message: err.message,
  });
};
