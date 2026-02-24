import { Router } from "express";
import {
  sendMessage,
  streamMessage,
  getHistory,
  clearHistory,
  getUsage,
} from "./chat.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { chatLimiter } from "../../middlewares/rateLimiter.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/message", chatLimiter, sendMessage);
router.post("/stream", chatLimiter, streamMessage);
router.get("/history", getHistory);
router.delete("/history", clearHistory);
router.get("/usage", getUsage);

export default router;
