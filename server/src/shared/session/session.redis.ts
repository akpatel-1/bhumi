import crypto from 'node:crypto';

import { redis } from '@infra/redis/redis.js';
import { SESSION_CONFIG } from '@shared/session/session.config.js';

import { AUTH_CONFIG } from '../auth/auth.config.js';

type UserSession = {
  id: string;
  role: 'admin' | 'registrar';
  createdAt: string;
  expiresAt: string;
};

export const createUserSession = async (
  id: string,
  role: 'admin' | 'registrar',
): Promise<string> => {
  const sessionId = crypto.randomUUID();

  const key = `${AUTH_CONFIG.getCookieName(role)}${sessionId}`;
  const data: UserSession = {
    id,
    role,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + SESSION_CONFIG.SESSION_TTL * 1000).toISOString(),
  };
  await redis.set(key, data, { ex: SESSION_CONFIG.SESSION_TTL });
  return sessionId;
};

export const deleteUserSession = async (sessionId: string, role: 'admin' | 'registrar') => {
  const key = `${AUTH_CONFIG.getCookieName(role)}${sessionId}`;
  await redis.del(key);
};

export const getUserSession = async (
  sessionId: string,
  role: 'admin' | 'registrar',
): Promise<UserSession | null> => {
  const key = `${AUTH_CONFIG.getCookieName(role)}${sessionId}`;

  return await redis.get(key);
};
