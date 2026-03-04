import { Request, Response, NextFunction } from "express";
import { deleteChatSchema, getChatMessagesSchema, startNewChatSchema, streamMessageSchema, updateChatSchema } from "./chat.validation";
import { getChatByIdService, getChatMessagesService, getUsageService, getUserChatsService, deleteChatByIdService, updateChatByIdService, startNewChatService, streamMessageService } from "./chat.service";

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


export const startNewChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      return next(Object.assign(new Error("Not authenticated"), { statusCode: 401 }));
    };

    const { id: userId } = req.user;

    const validatedData = startNewChatSchema.safeParse(req);
    if(!validatedData.success){
      return next(validatedData.error);
    };

    const { message, personaId, model, temperature, maxTokens } = validatedData.data.body;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const onMeta = (chatId: string) => {
      res.write(`data: ${JSON.stringify({
        type: 'meta',
        chatId
      })}\n\n`);
    };

    const onChunk = (text: string) => {
      res.write(`data: ${JSON.stringify({
        type: 'chunk',
        content: text
      })}\n\n`);
    };

    const { reply, tokensUsed, cost, model: userModel } = await startNewChatService(userId, message, { personaId, model, temperature, maxTokens }, onMeta, onChunk);

    res.write(`data: ${JSON.stringify({
      type: 'done',
      tokensUsed,
      cost,
      model: userModel
    })}\n\n`);

    res.end();
  }
  catch (err) {
    res.write(`data: ${JSON.stringify({
      type: 'error',
      message: (err as Error).message
    })}\n\n`);
    res.end();
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
    const { title, model, temperature, maxTokens, personaId, systemPrompt } = validatedData.data.body;

    const existingChat = await getChatByIdService(chatId);
    if (!existingChat || existingChat.userId !== userId) {
      return next(Object.assign(new Error("Chat not found"), { statusCode: 404 }));
    };

    const updatedChat = await updateChatByIdService(chatId, { title, model, temperature, maxTokens, personaId, systemPrompt });

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
    const { page, limit } = validatedData.data.query;

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

export const streamMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      return next(Object.assign(new Error("Not authenticated"), { statusCode: 401 }));
    };

    const { id: userId } = req.user;

    const validatedData = streamMessageSchema.safeParse(req);
    if(!validatedData.success){
      return next(validatedData.error);
    };

    const { chatId } = validatedData.data.params;
    const { message } = validatedData.data.body;

    const existingChat = await getChatByIdService(chatId);
    if (!existingChat || existingChat.userId !== userId) {
      return next(Object.assign(new Error("Chat not found"), { statusCode: 404 }));
    };

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    
    const onChunk = (text: string) => {
      res.write(`data: ${JSON.stringify({
        type: 'chunk',
        content: text
      })}`)
    };

    const { reply, tokensUsed, cost, model } = await streamMessageService(chatId, message, onChunk);

    res.write(`data: ${JSON.stringify({
      type: 'done',
      tokensUsed,
      cost,
      model
    })}\n\n`);

    res.end();
  } 
  catch (err) {
    res.write(`data: ${JSON.stringify({
      type: 'error',
      message: (err as Error).message
    })}`);
    res.end();
  }
};