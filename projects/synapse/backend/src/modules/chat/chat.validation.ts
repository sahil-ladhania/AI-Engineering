import { z } from "zod";

export const ChatModel = z.enum(["gpt-4o", "gpt-4o-mini"]);

const messageSettingsSchema = z.object({
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().min(1).max(16384).optional(),
  systemPrompt: z.string().max(2000).optional(),
});

export const sendMessageSchema = z.object({
  body: z.object({
    message: z.string().min(1, "Message cannot be empty").max(8000),
    model: ChatModel.default("gpt-4o-mini"),
    settings: messageSettingsSchema.optional(),
  }),
});

export const streamMessageSchema = z.object({
  body: z.object({
    message: z.string().min(1, "Message cannot be empty").max(8000),
    model: ChatModel.default("gpt-4o-mini"),
    settings: messageSettingsSchema.optional(),
  }),
});

export const getHistorySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>["body"];
export type StreamMessageInput = z.infer<typeof streamMessageSchema>["body"];
export type GetHistoryQuery = z.infer<typeof getHistorySchema>["query"];
export type ChatModelType = z.infer<typeof ChatModel>;
