
type ModelPricing = {
  input: number;  
  output: number;
};

export const PRICING: Record<string, ModelPricing> = {
  "gpt-4o":      { input: 2.50,  output: 10.00 },
  "gpt-4o-mini": { input: 0.15,  output: 0.60  },
};

export const calculateCost = ( inputTokens: number, outputTokens: number, model: string ): number => {
  const pricing = PRICING[model];

  if (!pricing) {
    throw new Error(`Unknown model for cost calculation: "${model}"`);
  };

  const inputCost  = (inputTokens  / 1_000_000) * pricing.input;
  const outputCost = (outputTokens / 1_000_000) * pricing.output;

  return parseFloat((inputCost + outputCost).toFixed(8));
};