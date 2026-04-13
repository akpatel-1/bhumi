import { redis } from '../../../infra/redis/redis.js';
import { USER_AUTH_CONFIG } from './user-auth.config.js';

export const storeUserOtp = async (hashedEmail: string, hashedOtp: string): Promise<void> => {
  const key = `${USER_AUTH_CONFIG.OTP_PREFIX}${hashedEmail}`;
  await redis.set(key, { hashedOtp }, { ex: USER_AUTH_CONFIG.OTP_TTL });
};

export const deleteUserOtp = async (hashedEmail: string): Promise<void> => {
  const key = `${USER_AUTH_CONFIG.OTP_PREFIX}${hashedEmail}`;
  await redis.del(key);
};
