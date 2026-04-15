import { Redis } from '@upstash/redis';
import 'dotenv/config';

import { env } from '@/config/env.js';

export const redis = new Redis({
  url: env.upstashRedisRestUrl,
  token: env.upstashRedisRestToken,
});
