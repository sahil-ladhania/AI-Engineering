import { Chat, Message } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { countMessageTokens, countTokens } from "../../utils/tokenCounter";
import openai from "../../config/openai";
import { calculateCost } from "../../utils/costCalculator";

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
    if (!modelMap[chat.model]) {
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

export const startNewChatService = async ( userId: string, message: string, settings: { personaId: string; model: string; temperature?: number; maxTokens: number }, onMeta: (chatId: string) => void, onChunk: (text: string) => void ): Promise<{ reply: string; tokensUsed: number; cost: number; model: string }> => {
  const persona = await prisma.persona.findUnique({
    where: {
      id: settings.personaId
    }
  });
  
  const resolvedPersona = persona ?? await prisma.persona.findUnique({ where: { id: "default" } });
  if (!resolvedPersona) throw new Error("Persona not found. Please run the seed.");

  const finalTemperature = settings.temperature ?? resolvedPersona.temperature;
  const systemPrompt = resolvedPersona.prompt + `\n\nToday's date is ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.`;

  const chat = await prisma.chat.create({
    data: {
      userId,
      personaId: resolvedPersona?.id,
      model: settings.model,
      temperature: finalTemperature,
      maxTokens: settings.maxTokens,
      systemPrompt,
      title: "New Chat"
    }
  });
  onMeta(chat.id);

  const messages = [
    { role: "system" as const, content: systemPrompt },
    { role: "user" as const, content: message }
  ];

  const inputTokens = countMessageTokens(messages, settings.model);

  const stream = await openai.chat.completions.create({
    model:settings.model,
    messages,
    temperature: finalTemperature,
    max_tokens: settings.maxTokens,
    stream: true
  });

  let fullReply = "";
  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content ?? "";
    if(text){
      fullReply = fullReply + text;
      onChunk(text);
    };
  };

  const outputTokens = countTokens(fullReply , settings.model);
  const cost = calculateCost(inputTokens , outputTokens , settings.model);

  await prisma.message.create({
    data: {
      chatId: chat.id,
      role: "user",
      content: message,
      tokens: inputTokens,
      cost: 0
    }
  });

  await prisma.message.create({
    data: { 
      chatId: chat.id, 
      role: "assistant", 
      content: fullReply, 
      tokens: outputTokens, 
      cost
    }
  });

  await prisma.chat.update({ 
    where: { 
      id: chat.id 
    }, 
    data: { 
      updatedAt: new Date()
    } 
  });

  return { 
    reply: fullReply, 
    tokensUsed: inputTokens + outputTokens, 
    cost, 
    model: settings.model
  };
};

export const getChatByIdService = async (chatId: string): Promise<Chat | null> => {
  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId
    }
  });

  return chat;
};

export const updateChatByIdService = async (chatId: string, data: { title?: string; model?: string; temperature?: number; maxTokens?: number; personaId?: string | null; systemPrompt?: string | null }): Promise<Chat> => {
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

export const getChatMessagesService = async (chatId: string, { page, limit }: { page: number; limit: number }): Promise<{ messages: Message[]; total: number }> => {
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

export const streamMessageService = async ( chatId: string, message: string, onChunk: (text: string) => void ): Promise<{ reply: string; tokensUsed: number; cost: number; model: string }> => {
  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId
    }
  });

  if(!chat){
    throw new Error("Chat Not Found !!!");
  };

  let systemPrompt = "";

  if (chat.systemPrompt) {
    systemPrompt = chat.systemPrompt;
  } 
  else if (chat.personaId) {
    const persona = await prisma.persona.findUnique({ where: { id: chat.personaId } });
    systemPrompt = persona?.prompt ?? "";
  };

  systemPrompt = systemPrompt + `\n\nToday's date is ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.`;

  const history = await prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
    take: 20
  });

  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...history.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user" as const, content: message }
  ];

  const inputTokens = countMessageTokens(messages, chat.model);

  const stream = await openai.chat.completions.create({
    model: chat.model,
    messages,
    temperature: chat.temperature,
    max_tokens: chat.maxTokens,
    stream: true
  });

  let fullReply = "";
  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content ?? "";
    if (text) {
      fullReply = fullReply + text;
      onChunk(text);
    };
  };

  const outputTokens = countTokens(fullReply, chat.model);
  const cost = calculateCost(inputTokens, outputTokens, chat.model);

  await prisma.message.create({
    data: { 
      chatId, 
      role: "user", 
      content: message, 
      tokens: inputTokens, 
      cost: 0 
    }
  });

  await prisma.message.create({
    data: { 
      chatId, 
      role: "assistant", 
      content: fullReply, 
      tokens: outputTokens, 
      cost 
    }
  });

  await prisma.chat.update({ 
    where: { 
      id: chatId 
    }, 
    data: { 
      updatedAt: new Date() 
    }
  });

  return { 
    reply: fullReply, 
    tokensUsed: inputTokens + outputTokens, 
    cost, 
    model: chat.model 
  };
};