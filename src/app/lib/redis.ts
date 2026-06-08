import { Redis } from '@upstash/redis';

// Pastikan environment variables ini nanti diisi di Vercel
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});