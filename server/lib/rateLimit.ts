import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const rateLimit = async (
  key: string,
  limit: number,
  durationSeconds: number
) => {
  const redisKey =
    process.env.NODE_ENV === "development" ? "dev-local" : `rate_limit:${key}`;

  const current = await redis.incr(redisKey);

  const ttl = await redis.ttl(redisKey);
  if (ttl === -1) {
    await redis.expire(redisKey, durationSeconds);
  }

  return current <= limit;
};
