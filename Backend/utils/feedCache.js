import { createHash, randomUUID } from "node:crypto";
import { redisCommand } from "../config/redis.js";

const TTL_SECONDS = 5 * 60;
const namespace = () => process.env.REDIS_KEY_PREFIX || "blogosphere:feeds:v1";
const generationKey = () => `${namespace()}:generation`;

async function generation() {
  let value = await redisCommand((redis) => redis.get(generationKey()));
  if (value === null) {
    await redisCommand((redis) => redis.set(generationKey(), randomUUID(), { NX: true }));
    value = await redisCommand((redis) => redis.get(generationKey()));
  }
  return value;
}

export async function cachedFeed(name, filters, load) {
  const version = await generation();
  const hash = createHash("sha256").update(JSON.stringify(filters)).digest("hex");
  const key = version ? `${namespace()}:${version}:${name}:${hash}` : null;
  if (key) {
    const cached = await redisCommand((redis) => redis.get(key));
    if (cached) {
      try { return JSON.parse(cached); }
      catch { /* Replace an invalid entry with fresh database results. */ }
    }
  }
  const result = await load();
  if (key) {
    // In-flight readers write only to their original generation, never a new one.
    await redisCommand((redis) => redis.set(key, JSON.stringify(result), { EX: TTL_SECONDS }));
  }
  return result;
}

export async function invalidateFeeds() {
  // One shared generation invalidates every category/tag combination on all servers.
  await redisCommand((redis) => redis.set(generationKey(), randomUUID()));
}
