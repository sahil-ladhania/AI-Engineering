import { Request, Response, NextFunction } from "express";
import { loginSchema, registerSchema } from "./auth.validation";
import { checkIfUserExist, getUserById, registerUser } from "./auth.service";
import { AppError } from "../../middlewares/error.middleware";
import jwt from 'jsonwebtoken';
import { comparePasswords, hashPassword } from "../../utils/password";
import { env } from "../../config/env";
import redis from "../../config/redis";

export const COOKIE_NAME = "jwt_token";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = registerSchema.safeParse(req);
    if (!validatedData.success) {
      return next(validatedData.error);
    };

    const { name, email, password } = validatedData.data.body;

    const hashedPassword = await hashPassword(password);

    const newUser = await registerUser({ name, email, password: hashedPassword });

    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email 
      },
      env.JWT_SECRET,
      { 
        expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] 
      }
    );

    res.cookie(COOKIE_NAME, token, {
      ...COOKIE_OPTIONS,
      maxAge: (7 * 24 * 60 * 60 * 1000),
    });

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      data: { user: userWithoutPassword },
    });
  } 
  catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = loginSchema.safeParse(req);
    if (!validatedData.success) {
      return next(validatedData.error);
    }

    const { email, password } = validatedData.data.body;

    const user = await checkIfUserExist(email);
    if (!user) {
      const err = new Error("Invalid credentials") as AppError;
      err.statusCode = 401;
      return next(err);
    }

    const isMatch = await comparePasswords({ password, hashedPassword: user.password });
    if (!isMatch) {
      const err = new Error("Invalid credentials") as AppError;
      err.statusCode = 401;
      return next(err);
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email 
      },
      env.JWT_SECRET,
      { 
        expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] 
      }
    );

    res.cookie(COOKIE_NAME, token, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: { 
        user: userWithoutPassword 
      },
    });
  } 
  catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies[COOKIE_NAME];

    if (token) {
      const decoded = jwt.decode(token) as { exp?: number } | null;
      if (decoded?.exp) {
        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
          await redis.set(`blacklist:${token}`, "1", "EX", ttl);
        };
      };
    };

    res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
    res.status(200).json({ success: true, message: "Logged Out Successfully." });
  } 
  catch (err) {
    next(err);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      const err = new Error("Not authenticated") as AppError;
      err.statusCode = 401;
      return next(err);
    };

    const user = await getUserById(req.user.id);
    if (!user) {
      const err = new Error("User not found") as AppError;
      err.statusCode = 404;
      return next(err);
    };

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: { 
        user: userWithoutPassword 
      },
    });
  } 
  catch (err) {
    next(err);
  }
};