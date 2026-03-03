import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redis from "../config/redis";

const store = new RedisStore({
  sendCommand: (command: string, ...args: string[]) => redis.call(command, ...args) as any,
});

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  store,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { 
    success: false, 
    message: "Too many attempts, please try again later." 
  },
  store,
});

export const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: { 
    success: false, 
    message: "Too many requests, slow down." 
  },
  store,
});