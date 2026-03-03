import { Router } from "express";
import {
  createChat,
  getChats,
  updateChat,
  deleteChat,
  getChatMessages,
  sendMessage,
  streamMessage,
  getUsage,
} from "./chat.controller";
import { authorize } from "../../middlewares/auth.middleware";
import { chatLimiter } from "../../middlewares/rateLimiter.middleware";

const router = Router();

router.use(authorize);

router.post("/", createChat);
router.get("/", getChats);
router.patch("/:chatId", updateChat);
router.delete("/:chatId", deleteChat);
router.get("/:chatId/messages", getChatMessages);
router.post("/:chatId/message", chatLimiter, sendMessage);
router.post("/:chatId/stream", chatLimiter, streamMessage);
router.get("/usage", getUsage);

export default router;