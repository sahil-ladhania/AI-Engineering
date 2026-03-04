import { Router } from "express";
import {
  getChats,
  updateChat,
  deleteChat,
  getChatMessages,
  streamMessage,
  startNewChat,
  getUsage,
} from "./chat.controller";
import { authorize } from "../../middlewares/auth.middleware";
import { chatLimiter } from "../../middlewares/rateLimiter.middleware";

const router = Router();

router.use(authorize);

router.get("/", getChats);
router.get("/usage", getUsage)
router.post("/", chatLimiter, startNewChat); 
router.patch("/:chatId", updateChat);
router.delete("/:chatId", deleteChat);
router.get("/:chatId/messages", getChatMessages);
router.post("/:chatId/stream", chatLimiter, streamMessage);

export default router;