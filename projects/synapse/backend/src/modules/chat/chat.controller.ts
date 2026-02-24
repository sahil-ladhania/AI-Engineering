import { Request, Response, NextFunction } from "express";

export const sendMessage = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // 1. Read userId from req.user.id
  //    - If req.user is undefined → throw 401
  // 2. Validate req.body against sendMessageSchema
  //    - If validation fails → throw 400 with zod error details
  // 3. Destructure { message, model, settings } from validated body
  // 4. Call processMessage(userId, message, { model, ...settings })
  // 5. Return 200 { success: true, data: { reply, tokensUsed, cost, model } }
  try {
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const streamMessage = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // 1. Read userId from req.user.id
  //    - If req.user is undefined → throw 401
  // 2. Validate req.body against streamMessageSchema
  //    - If validation fails → throw 400 with zod error details
  // 3. Destructure { message, model, settings } from validated body
  // 4. Set SSE response headers:
  //    res.setHeader("Content-Type", "text/event-stream")
  //    res.setHeader("Cache-Control", "no-cache")
  //    res.setHeader("Connection", "keep-alive")
  //    res.flushHeaders()
  // 5. Call streamMessage(userId, message, { model, ...settings })
  //    - On each chunk received: res.write(`data: ${JSON.stringify({ chunk })}\n\n`)
  //    - On stream end: res.write("data: [DONE]\n\n") then res.end()
  //    - On stream error: res.write(`data: ${JSON.stringify({ error })}\n\n`) then res.end()
  try {
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const getHistory = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // 1. Read userId from req.user.id
  //    - If req.user is undefined → throw 401
  // 2. Validate req.query against getHistorySchema
  //    - Destructure { page, limit } from validated query
  // 3. Call getHistory(userId, { page, limit })
  // 4. Return 200 { success: true, data: { messages, total, page, limit } }
  try {
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const clearHistory = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // 1. Read userId from req.user.id
  //    - If req.user is undefined → throw 401
  // 2. Call clearHistory(userId)
  // 3. Return 200 { success: true, message: "Chat history cleared" }
  try {
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const getUsage = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // 1. Read userId from req.user.id
  //    - If req.user is undefined → throw 401
  // 2. Call getUsage(userId)
  // 3. Return 200 { success: true, data: { totalTokens, totalCost, breakdown: { model, tokens, cost }[] } }
  try {
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};
