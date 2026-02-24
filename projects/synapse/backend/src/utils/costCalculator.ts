// Pricing per 1,000 tokens — update as OpenAI pricing changes.
// Source: https://openai.com/pricing
// These are blended input+output estimates. For precise billing,
// track input and output tokens separately and apply their individual rates.
export const PRICING: Record<string, number> = {
  "gpt-4o": 0.005,
  "gpt-4o-mini": 0.00015,
};

export const calculateCost = (_tokens: number, _model: string): number => {
  // 1. Look up the price per 1,000 tokens for _model in PRICING:
  //    const pricePerThousand = PRICING[_model]
  //
  // 2. If _model is not found in PRICING:
  //    - Option A: throw new Error(`Unknown model for cost calculation: ${_model}`)
  //    - Option B: return 0 and log a warning (silent fallback)
  //
  // 3. Convert to per-token rate:
  //    const pricePerToken = pricePerThousand / 1000
  //
  // 4. Calculate total cost:
  //    const cost = _tokens * pricePerToken
  //
  // 5. Return cost rounded to 8 decimal places to avoid floating-point noise:
  //    parseFloat(cost.toFixed(8))
  throw new Error("Not implemented");
};
