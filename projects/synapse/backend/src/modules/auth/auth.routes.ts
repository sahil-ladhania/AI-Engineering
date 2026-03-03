import { Router } from "express";
import {
  register,
  login,
  logout,
  getMe,
} from "./auth.controller";
import { authorize } from "../../middlewares/auth.middleware";
import { authLimiter } from "../../middlewares/rateLimiter.middleware";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", authorize , logout);
router.get("/me", authorize , getMe);

export default router;