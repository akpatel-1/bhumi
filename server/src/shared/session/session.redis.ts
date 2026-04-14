import crypto from 'node:crypto';

import { redis } from '../../infra/redis/redis.js';
import { SESSION_CONFIG } from './session.config.js';

type UserSession = {
  userId: string;
  role: string;
  createdAt: string;
  expiresAt: string;
};

const getSessionKey = (sessionId: string, role: string) => {
  const sessionName =
    role === 'admin'
      ? SESSION_CONFIG.ADMIN_SESSION_PREFIX
      : SESSION_CONFIG.REGISTRAR_SESSION_PREFIX;
  return `${sessionName}${sessionId}`;
};

export const createUserSession = async (userId: string, role: string): Promise<string> => {
  const sessionId = crypto.randomUUID();

  const key = getSessionKey(sessionId, role);
  const data: UserSession = {
    userId,
    role,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + SESSION_CONFIG.SESSION_TTL * 1000).toDateString(),
  };
  await redis.set(key, data, { ex: SESSION_CONFIG.SESSION_TTL });
  return sessionId;
};

export const deleteUserSession = async (sessionId: string, role: string) => {
  const key = getSessionKey(sessionId, role);
  await redis.del(key);
};
