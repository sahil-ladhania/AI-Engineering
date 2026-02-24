import rateLimit from "express-rate-limit";

// Applied globally to every route via app.use() in app.ts.
// Protects against general abuse and scraping.
// Allows 100 requests per IP within any rolling 15-minute window.
// On limit exceeded → express-rate-limit automatically returns 429 Too Many Requests.
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// Applied only to /api/chat routes (message + stream) in chat.routes.ts.
// Prevents excessive OpenAI API calls which have per-token cost implications.
// Allows 20 requests per IP within any rolling 1-minute window.
// On limit exceeded → returns 429 with the custom message below.
// TODO: Consider switching to a Redis-backed store (e.g. rate-limit-redis)
//       so limits are shared across multiple server instances in production.
export const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: "Too many requests, slow down.",
});
