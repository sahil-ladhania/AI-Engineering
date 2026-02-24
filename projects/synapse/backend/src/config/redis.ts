import Redis from "ioredis";
import { env } from "./env";

const redis = new Redis(env.REDIS_URL);

redis.on("connect", () => {
  console.log("Redis connected.");
});

redis.on("error", (err: Error) => {
  console.error("Redis error:", err.message);
});

redis.on("close", () => {
  console.log("Redis connection closed.");
});

export default redis;
