import { Chat, Message } from "@prisma/client";
import { prisma } from "../../config/prisma";

export const createChatService = async ({ userId, title, model }: { userId: string; title?: string; model: string }): Promise<Chat> => {
  const newChat = await prisma.chat.create({
    data: {
      userId,
      title: title ?? "New Chat",
      model,
    },
  });

  return newChat;
};

export const getUserChatsService = async (userId: string): Promise<Chat[]> => {
  const userChats = await prisma.chat.findMany({
    where: {
      userId: userId
    },
    orderBy: {
      updatedAt: "desc"
    }
  });

  return userChats;
};

export const getChatByIdService = async (chatId: string): Promise<Chat | null> => {
  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId
    }
  });

  return chat;
};

export const updateChatByIdService = async ( chatId: string, data: { title?: string; model?: string; temperature?: number; maxTokens?: number; systemPrompt?: string | null } ): Promise<Chat> => {
  const updatedChat = await prisma.chat.update({
    where: {
      id: chatId
    },
    data
  });

  return updatedChat;
};

export const deleteChatByIdService = async (chatId: string): Promise<void> => {
  await prisma.chat.delete({
    where: {
      id: chatId
    }
  });
};

export const getChatMessagesService = async ( chatId: string, { page, limit }: { page: number; limit: number } ): Promise<{ messages: Message[]; total: number }> => {
  const messagesCount = await prisma.message.count({
    where: {
      chatId: chatId
    }
  });

  const messages = await prisma.message.findMany({
    where: {
      chatId
    },
    orderBy: {
      createdAt: "asc"
    },
    skip: (page - 1) * limit,
    take: limit
  });

  return {
    messages,
    total: messagesCount
  }
};

export const getUsageService = async (userId: string): Promise<{ totalTokens: number; totalCost: number; breakdown: { model: string; tokens: number; cost: number }[] }> => {
  const chatsWithMessages = await prisma.chat.findMany({
    where: { 
      userId: userId
    },
    select: {
      model: true,
      messages: {
        select: {
          tokens: true,
          cost: true
        }
      }
    }
  });

  let totalTokens = 0;
  let totalCost = 0;
  const modelMap: Record<string, { tokens: number; cost: number }> = {};

  for (const chat of chatsWithMessages) {
    if (!modelMap[chat.model]){
      modelMap[chat.model] = { tokens: 0, cost: 0 };
    };

    for (const msg of chat.messages) {
      totalTokens += msg.tokens;
      totalCost += msg.cost;
      modelMap[chat.model].tokens += msg.tokens;
      modelMap[chat.model].cost += msg.cost;
    };
  };

  const breakdown = Object.entries(modelMap).map(([model, { tokens, cost }]) => ({
    model, tokens, cost
  }));

  return { totalTokens, totalCost, breakdown };
};

export const processMessageService = async ( chatId: string, message: string, settings: Record<string, unknown> ): Promise<unknown> => {
  // 1. Fetch recent messages in this chat for context:
  //    prisma.message.findMany({ where: { chatId }, orderBy: { createdAt: "asc" }, take: 20 })
  //    - Map to OpenAI format: [{ role, content }, ...]
  const messages = await prisma.message.findMany({
    where: {
      chatId: chatId
    },
    orderBy: {
      createdAt: 'asc'
    },
    take: 20
  });

  // 2. Prepend system prompt if settings.systemPrompt is provided
  // 3. Append the new user message to the messages array
  // 4. Call OpenAI chat completions (non-streaming):
  //    openai.chat.completions.create({ model: settings.model, messages, temperature: settings.temperature, max_tokens: settings.maxTokens, stream: false })
  // 5. Extract assistant reply: response.choices[0].message.content
  // 6. Count tokens: countTokens(promptText, model) + countTokens(replyText, model)
  // 7. Calculate cost: calculateCost(totalTokens, model)
  // 8. Persist user message:
  //    prisma.message.create({ data: { chatId, role: "user", content: message, tokens: promptTokens, cost: 0 } })
  // 9. Persist assistant reply:
  //    prisma.message.create({ data: { chatId, role: "assistant", content: replyText, tokens: replyTokens, cost } })
  // 10. Bubble chat to top of sidebar by updating updatedAt:
  //     prisma.chat.update({ where: { id: chatId }, data: { updatedAt: new Date() } })
  // 11. Return { reply: replyText, tokensUsed: totalTokens, cost, model }
  throw new Error("Not implemented");
};

export const streamProcessMessageService = async ( chatId: string, message: string, settings: Record<string, unknown>, onChunk: (text: string) => void ): Promise<{ reply: string; tokensUsed: number; cost: number; model: string }> => {
  // 1. Fetch chat from DB to get model, temperature, maxTokens, systemPrompt:
  //    const chat = await prisma.chat.findUnique({ where: { id: chatId } })
  //    const model = (settings.model as string) ?? chat.model
  //    const temperature = (settings.temperature as number) ?? chat.temperature
  //    const maxTokens = (settings.maxTokens as number) ?? chat.maxTokens
  //    const systemPrompt = (settings.systemPrompt as string) ?? chat.systemPrompt ?? getDefaultAssistantPrompt()
  // 2. Fetch last 20 messages for conversation context:
  //    const history = await prisma.message.findMany({ where: { chatId }, orderBy: { createdAt: "asc" }, take: 20 })
  // 3. Build messages array for OpenAI:
  //    const messages = [
  //      { role: "system", content: systemPrompt },
  //      ...history.map(m => ({ role: m.role, content: m.content })),
  //      { role: "user", content: message }
  //    ]
  // 4. Count input tokens BEFORE the call (tiktoken, since stream won't give usage upfront):
  //    const inputTokens = countMessageTokens(messages, model)
  // 5. Call OpenAI with stream: true:
  //    const stream = await openai.chat.completions.create({ model, messages, temperature, max_tokens: maxTokens, stream: true })
  // 6. Iterate stream chunks, accumulate fullReply, and call onChunk per piece:
  //    let fullReply = ""
  //    for await (const chunk of stream) {
  //      const text = chunk.choices[0]?.delta?.content ?? ""
  //      if (text) { fullReply += text; onChunk(text) }
  //    }
  // 7. Count output tokens AFTER stream completes:
  //    const outputTokens = countTokens(fullReply, model)
  // 8. Calculate cost:
  //    const cost = calculateCost(inputTokens, outputTokens, model)
  // 9. Persist user message:
  //    await prisma.message.create({ data: { chatId, role: "user", content: message, tokens: inputTokens, cost: 0 } })
  // 10. Persist assistant reply:
  //    await prisma.message.create({ data: { chatId, role: "assistant", content: fullReply, tokens: outputTokens, cost } })
  // 11. Bubble chat to top of sidebar by updating updatedAt:
  //    await prisma.chat.update({ where: { id: chatId }, data: { updatedAt: new Date() } })
  // 12. Return result:
  //    return { reply: fullReply, tokensUsed: inputTokens + outputTokens, cost, model }
  throw new Error("Not implemented");
};