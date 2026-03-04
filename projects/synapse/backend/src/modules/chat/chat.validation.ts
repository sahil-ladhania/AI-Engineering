import { z } from "zod";

export const ChatModel = z.enum(["gpt-4o", "gpt-4o-mini"]);

export const startNewChatSchema = z.object({
  body: z.object({
    message: z.string().min(1, "Message cannot be empty").max(8000),
    personaId: z.string().optional().default("default"),
    model: ChatModel.optional().default("gpt-4o-mini"),
    temperature: z.number().min(0).max(2).optional(),
    maxTokens: z.number().int().min(1).max(16384).optional().default(1024),
  }),
});

export const updateChatSchema = z.object({
  params: z.object({
    chatId: z.string().min(1, "Chat ID is required"),
  }),
  body: z.object({
    title: z.string().max(100).optional(),
    model: ChatModel.optional(),
    temperature: z.number().min(0).max(2).optional(),
    maxTokens: z.number().int().min(1).max(16384).optional(),
    personaId: z.string().nullable().optional(),
    systemPrompt: z.string().max(8000).nullable().optional(),
  }).refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided to update" }
  ),
});

export const deleteChatSchema = z.object({
  params: z.object({
    chatId: z.string().min(1, "Chat ID is required"),
  }),
});

export const getChatMessagesSchema = z.object({
  params: z.object({
    chatId: z.string().min(1, "Chat ID is required"),
  }),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
});

export const streamMessageSchema = z.object({
  params: z.object({
    chatId: z.string().min(1, "Chat ID is required"),
  }),
  body: z.object({
    message: z.string().min(1, "Message cannot be empty").max(8000),
  }),
});

export type StartNewChatInput = z.infer<typeof startNewChatSchema>["body"];
export type UpdateChatInput = z.infer<typeof updateChatSchema>["body"];
export type GetChatMessagesQuery = z.infer<typeof getChatMessagesSchema>["query"];
export type StreamMessageInput = z.infer<typeof streamMessageSchema>["body"];
export type ChatModelType = z.infer<typeof ChatModel>;
