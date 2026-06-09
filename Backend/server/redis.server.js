import Redis from 'ioredis'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Upstash requires TLS — ensure we use rediss:// protocol
const redisClient = new Redis(REDIS_URL, {
  tls: REDIS_URL.includes('upstash.io') ? {} : undefined,
  maxRetriesPerRequest: null,
  retryStrategy(times) {
    if (times > 10) {
      console.log('❌ Redis: max reconnection attempts reached, stopping retries');
      return null; // stop retrying
    }
    const delay = Math.min(times * 200, 5000);
    return delay;
  },
});

// Log only once on first successful connection
let hasConnected = false;
redisClient.on("ready", () => {
  if (!hasConnected) {
    console.log('✅ Connected to Redis successfully');
    hasConnected = true;
  }
});

redisClient.on("error", (err) => {
  console.log('❌ Redis connection error:', err.message);
});

redisClient.on("reconnecting", () => {
  console.log('🔄 Redis reconnecting...');
});

export { redisClient }