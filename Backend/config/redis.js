import { createClient } from "redis";

let client;
let lastWarning = 0;
let retryAfter = 0;

function warn() {
  const now = Date.now();
  if (now - lastWarning <= 30000) return;
  console.warn("Redis cache unavailable; using MongoDB.");
  lastWarning = now;
}

export async function connectRedis() {
  if (!process.env.REDIS_URL || client || Date.now() < retryAfter) return;
  let connecting;
  try {
    connecting = createClient({
      url: process.env.REDIS_URL,
      disableOfflineQueue: true,
      socket: {
        connectTimeout: 1000,
        reconnectStrategy: (retries) => Math.min(1000 * (retries + 1), 10000),
      },
    });
    client = connecting;
    connecting.on("error", warn);
    connecting.on("ready", () => console.log("Redis connected"));
    await connecting.connect();
  } catch {
    warn();
    if (client === connecting) client = undefined;
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
