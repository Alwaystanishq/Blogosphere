import { createClient } from "redis";

let client;
let lastWarning = 0;
let retryAfter = 0;

function warn() {
  if (Date.now() - lastWarning > 30000) {
    console.warn("Redis cache unavailable; using MongoDB.");
    lastWarning = Date.now();
  }
}

export function connectRedis() {
  if (!process.env.REDIS_URL || client || Date.now() < retryAfter) return;
  try {
    client = createClient({
      url: process.env.REDIS_URL,
      disableOfflineQueue: true,
      socket: {
        connectTimeout: 1000,
        reconnectStrategy: (retries) => Math.min(1000 * (retries + 1), 10000),
      },
    });
    client.on("error", warn);
    const connecting = client;
    connecting.connect().catch(() => {
      warn();
      if (client === connecting) client = undefined;
      retryAfter = Date.now() + 10000;
    });
  } catch {
    warn();
    client = undefined;
    retryAfter = Date.now() + 10000;
  }
}

// Cache operations have a short deadline; no offline command queue blocks requests.
export async function redisCommand(operation) {
  connectRedis();
  const active = client;
  if (!active?.isReady) return undefined;
  let timer;
  try {
    return await Promise.race([
      operation(active),
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          if (client === active) {
            client = undefined;
            retryAfter = Date.now() + 10000;
          }
          if (active.isOpen) active.destroy();
          reject(new Error("Redis cache deadline exceeded"));
        }, 250);
      }),
    ]);
  } catch {
    warn();
    return undefined;
  } finally {
    clearTimeout(timer);
  }
}

export function disconnectRedis() {
  if (client?.isOpen) client.destroy();
  client = undefined;
}
