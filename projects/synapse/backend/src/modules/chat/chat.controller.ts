import { Request, Response, NextFunction } from "express";
import { createChatSchema, deleteChatSchema, getChatMessagesSchema, sendMessageSchema, updateChatSchema } from "./chat.validation";
import { createChatService, deleteChatByIdService, getChatByIdService, getChatMessagesService, getUsageService, getUserChatsService, processMessageService, updateChatByIdService } from "./chat.service";

export const createChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      return next(Object.assign(new Error("Not authenticated"), { statusCode: 401 }));
    }

    const validatedData = createChatSchema.safeParse(req);
    if (!validatedData.success) {
      return next(validatedData.error);
    }

    const { title, model } = validatedData.data.body;
    const { id: userId } = req.user;

    const newChat = await createChatService({ userId, title, model });

    res.status(201).json({ 
      success: true, 
      data: { 
        chat: newChat 
      }
    });
  }
  catch (err) {
    next(err);
  }
};

export const getChats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      return next(Object.assign(new Error("Not authenticated"), { statusCode: 401 }));
    };

    const { id: userId } = req.user;

    const userChats = await getUserChatsService(userId);

    res.status(200).json({
      success: true,
      data: { 
        chats: userChats 
      },
    });
  }
  catch (err) {
    next(err);
  };
};

export const updateChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      return next(Object.assign(new Error("Not authenticated"), { statusCode: 401 }));
    };

    const { id: userId } = req.user;

    const validatedData = updateChatSchema.safeParse(req);
    if (!validatedData.success) {
      return next(validatedData.error);
    }

    const { chatId } = validatedData.data.params;
    const { title , model , temperature , maxTokens , systemPrompt } = validatedData.data.body;

    const existingChat = await getChatByIdService(chatId);
    if (!existingChat || existingChat.userId !== userId) {
      return next(Object.assign(new Error("Chat not found"), { statusCode: 404 }));
    };

    const updatedChat = await updateChatByIdService(chatId, { title, model, temperature, maxTokens, systemPrompt });

    res.status(200).json({ 
      success: true, 
      data: { 
        chat: updatedChat 
      }
    });
  } 
  catch (err) {
    next(err);
  }
};

export const deleteChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      return next(Object.assign(new Error("Not authenticated"), { statusCode: 401 }));
    };

    const { id: userId } = req.user;

    const validatedData = deleteChatSchema.safeParse(req);
    if (!validatedData.success) {
      return next(validatedData.error);
    };

    const { chatId } = validatedData.data.params;
    
    const existingChat = await getChatByIdService(chatId);
    if (!existingChat || existingChat.userId !== userId) {
      return next(Object.assign(new Error("Chat not found"), { statusCode: 404 }));
    };

    await deleteChatByIdService(chatId);

    res.status(200).json({
      success: true,
      message: "Chat deleted successfully"
    });
  } 
  catch (err) {
    next(err);
  }
};

export const getChatMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      return next(Object.assign(new Error("Not authenticated"), { statusCode: 401 }));
    };

    const { id: userId } = req.user;

    const validatedData = getChatMessagesSchema.safeParse(req);
    if (!validatedData.success) {
      return next(validatedData.error);
    };

    const { chatId } = validatedData.data.params;

    const { page , limit } = validatedData.data.query;

    const existingChat = await getChatByIdService(chatId);
    if (!existingChat || existingChat.userId !== userId) {
      return next(Object.assign(new Error("Chat not found"), { statusCode: 404 }));
    };

    const { messages, total } = await getChatMessagesService(chatId, { page, limit });

    res.status(200).json({
      success: true,
      data: {
        messages,
        total,
        page,
        limit
      }
    });
  } 
  catch (err) {
    next(err);
  }
};

export const getUsage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      return next(Object.assign(new Error("Not authenticated"), { statusCode: 401 }));
    };

    const { id: userId } = req.user;

    const usage = await getUsageService(userId);
    
    res.status(200).json({ 
      success: true,
      data: usage
    });
  } 
  catch (err) {
    next(err);
  }
};

export const sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      return next(Object.assign(new Error("Not authenticated"), { statusCode: 401 }));
    };

    const { id: userId } = req.user;

    const validatedData = sendMessageSchema.safeParse(req);
    if (!validatedData.success) {
      return next(validatedData.error);
    }

    const { chatId } = validatedData.data.params;
    const { message , settings } = validatedData.data.body;
    
    const existingChat = await getChatByIdService(chatId);
    if (!existingChat || existingChat.userId !== userId) {
      return next(Object.assign(new Error("Chat not found"), { statusCode: 404 }));
    };

    const promptOutput = await processMessageService(chatId , message , {model: existingChat.model , ...settings});

    res.status(200).json({ 
      success: true ,
      data: promptOutput
    });
  }
  catch (err) {
    next(err);
  }
};

export const streamMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 1. Read userId from req.user.id
    //    - If req.user is undefined → return next(Object.assign(new Error("Not authenticated"), { statusCode: 401 }))
    // 2. Validate req against streamMessageSchema via safeParse(req)
    //    - If validation fails → return next(validatedData.error)
    // 3. Destructure { chatId } from validatedData.data.params
    // 4. Destructure { message, settings } from validatedData.data.body
    // 5. Call getChatByIdService(chatId) — verify chat exists and chat.userId === userId
    //    - If null or userId mismatch → return next(Object.assign(new Error("Chat not found"), { statusCode: 404 }))
    // 6. Set SSE headers — AFTER this point, headers are locked; next(err) won't work anymore:
    //    res.setHeader("Content-Type", "text/event-stream")
    //    res.setHeader("Cache-Control", "no-cache")
    //    res.setHeader("Connection", "keep-alive")
    //    res.flushHeaders()
    // 7. Define onChunk callback:
    //    const onChunk = (text: string) => res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`)
    // 8. Call streamProcessMessageService(chatId, message, { model: chat.model, ...settings }, onChunk) in inner try/catch:
    //    try {
    //      await streamProcessMessageService(chatId, message, { model: chat.model, ...settings }, onChunk)
    //      res.write("data: [DONE]\n\n")
    //      res.end()
    //    } catch (streamErr) {
    //      res.write(`data: ${JSON.stringify({ error: (streamErr as Error).message })}\n\n`)
    //      res.end()
    //    }
  } catch (err) {
    next(err);
  }
};