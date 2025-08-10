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
  const redisKey = `rate_limit:${key}`;

  const current = await redis.incr(redisKey);
  if (current === 1) {
    await redis.expire(redisKey, durationSeconds);
  }

  if (current > limit) {
    return false;
  }

  return true;
};
