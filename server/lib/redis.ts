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
    process.env.NODE_ENV === "development"
      ? `dev-local:${key}`
      : `rate_limit:${key}`;

  // Increment the counter
  const current = await redis.incr(redisKey);

  // Set expiry if it's a new key
  const ttl = await redis.ttl(redisKey);
  if (ttl === -1) {
    await redis.expire(redisKey, durationSeconds);
  }

  return {
    allowed: current <= limit,
    attempts: current <= limit ? limit - current : 0,
    remaining: ttl > 0 ? ttl : durationSeconds,
  };
};

export const getRedisCache = async <T = any>(
  key: string
): Promise<T | null> => {
  const data = await redis.get(key);
  if (!data) return null;

  try {
    return typeof data === "string" ? (JSON.parse(data) as T) : (data as T);
  } catch {
    console.warn("Invalid JSON from Redis key:", key, data);
    return null;
  }
};

export const setRedisCache = async (
  key: string,
  value: unknown,
  ttlSeconds?: number
) => {
  const stringValue = JSON.stringify(value);
  if (ttlSeconds) {
    return await redis.set(key, stringValue, { ex: ttlSeconds });
  } else {
    return await redis.set(key, stringValue);
  }
};

export const delRedis = async (key: string) => {
  return await redis.del(key);
};
