import crypto from 'node:crypto';

import { redis } from '../../../infra/redis/redis.js';
import { ADMIN_SESSION_CONFIG } from './admin-session.config.js';

type AdminSession = {
  adminId: string;
  role: string;
  createdAt: string;
  expiresAt: string;
};

export const repository = {
  create: async (adminId: string, role: string): Promise<string> => {
    const sessionId = crypto.randomUUID();
    const key = `${ADMIN_SESSION_CONFIG.SESSION_PREFIX}${sessionId}`;
    const data: AdminSession = {
      adminId,
      role,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + ADMIN_SESSION_CONFIG.SESSION_TTL * 1000).toDateString(),
    };
    await redis.set(key, data, { ex: ADMIN_SESSION_CONFIG.SESSION_TTL });
    return sessionId;
  },
};
