import { get_encoding, TiktokenEncoding } from "tiktoken";

export type ChatMessage = {
  role: string;
  content: string;
  name?: string;
};

const MODEL_ENCODING_MAP: Record<string, TiktokenEncoding> = {
  "gpt-4o": "o200k_base",
  "gpt-4o-mini": "o200k_base",
};

function getEncoder(model: string) {
  const encoding = MODEL_ENCODING_MAP[model];

  if (!encoding) {
    throw new Error(`Unsupported model for token counting: "${model}"`);
  };

  return get_encoding(encoding);
};

export function countTokens(text: string, model: string): number {
  const encoder = getEncoder(model);

  try {
    return encoder.encode(text).length;
  } 
  finally {
    encoder.free();
  }
};

export function countMessageTokens(messages: ChatMessage[], model: string): number {
  const encoder = getEncoder(model);

  let total = 0;

  try {
    for (const message of messages) {
      total += 3; 
      total += encoder.encode(message.role).length;
      total += encoder.encode(message.content).length;
      if (message.name) {
        total += encoder.encode(message.name).length;
        total += 1;
      };
    };

    total += 3;
  }
  finally {
    encoder.free();
  };

  return total;
};