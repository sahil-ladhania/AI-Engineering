import { Request, Response, NextFunction } from "express";
import { registerSchema } from "./auth.validation";
import { registerUser } from "./auth.service";
import jwt from 'jsonwebtoken'

// Cookie name used consistently across login, logout, and authMiddleware
export const COOKIE_NAME = "jwt_token";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

export const register = async ( _req: Request, res: Response, next: NextFunction ): Promise<void> => {
  try {
    // 1. Parse req.body
    // 2. Validate body against registerSchema
    //    - If validation fails → call next(zodError) and return early
    // 3. Call registerUser({ name, email, password })
    //    - If email already exists → service throws 409 → caught below → next(err)
    // 4. Sign a JWT for the newly created user (auto-login after register):
    //    jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN })
    // 5. Set the JWT as a httpOnly cookie using COOKIE_NAME and COOKIE_OPTIONS:
    //    maxAge: 7 * 24 * 60 * 60 * 1000  (convert JWT_EXPIRES_IN "7d" → ms)
    // 6. Strip the password field from the user object before sending
    // 7. Return 201 { success: true, data: { user } }
    res.status(200).json({ success: true });
  }
  catch (err) {
    next(err);
  }
};

export const login = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // 1. Parse req.body
  // 2. Validate body against loginSchema
  //    - If validation fails → call next(zodError) and return early
  // 3. Call loginUser(email, password)
  //    - If credentials are invalid → service throws 401 → caught below → next(err)
  // 4. Set the JWT as a httpOnly cookie:
  //    res.cookie(COOKIE_NAME, token, {
  //      ...COOKIE_OPTIONS,
  //      maxAge: 7 * 24 * 60 * 60 * 1000,   ← 7 days in ms, must match JWT_EXPIRES_IN
  //    })
  // 5. Strip the password field from the user object before sending
  // 6. Return 200 { success: true, data: { user } }
  //    - Do NOT send the token in the response body — it lives in the cookie only
  try {
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const logout = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // 1. Clear the cookie using the same name and options used when setting it:
  //    res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS)
  //    - Options must match exactly — mismatched options cause the browser to ignore clearCookie
  // 2. Return 200 { success: true, message: "Logged out successfully" }
  try {
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // 1. Read userId from req.user.id (populated by authMiddleware)
  //    - If req.user is undefined → throw AppError("Not authenticated", 401)
  // 2. Call getUserById(userId)
  //    - If user not found in DB → throw AppError("User not found", 404)
  // 3. Strip the password field from the returned user object
  // 4. Return 200 { success: true, data: { user } }
  try {
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};
