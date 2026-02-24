import { Request, Response, NextFunction } from "express";

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

export const authMiddleware = (
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  // 1. Extract the token from the signed httpOnly cookie only:
  //    const token = _req.cookies["token"]
  //    - No Authorization header fallback — this app is strictly cookie-based
  //
  // 2. If token is undefined or an empty string:
  //    - Create an AppError("Not authenticated", 401)
  //    - Call next(err) and return early — do NOT call next() below
  //
  // 3. Verify and decode the token:
  //    jwt.verify(token, env.JWT_SECRET)
  //    - Wrap in try/catch to handle JWT-specific errors:
  //      - jwt.TokenExpiredError → next(AppError("Session expired, please log in again", 401))
  //      - jwt.JsonWebTokenError → next(AppError("Invalid token", 401))
  //      - Any other error       → next(err)
  //
  // 4. Cast the decoded payload:
  //    const decoded = payload as { id: string; email: string }
  //
  // 5. Attach to request so downstream controllers can read it:
  //    _req.user = { id: decoded.id, email: decoded.email }
  //
  // 6. Call next() to hand off to the route handler
  next();
};
