import crypto from 'crypto';
import 'dotenv/config';
import jwt from 'jsonwebtoken';

import { env } from '@/config/env.js';

export const generateOtp = () => {
  const rawOtp = crypto.randomInt(100000, 1000000);
  const hashedOtp = crypto
    .createHmac('sha256', env.otpSecret)
    .update(rawOtp.toString())
    .digest('hex');

  return { rawOtp, hashedOtp };
};

export const generateHash = (value: string) => {
  return crypto.createHash('sha256').update(value).digest('hex');
};

export const matchOtp = (otp: string, storedOtp: string): boolean => {
  const generatedHash = crypto
    .createHmac('sha256', env.otpSecret)
    .update(otp.toString())
    .digest('hex');

  const bufferA = Buffer.from(generatedHash, 'hex');
  const bufferB = Buffer.from(storedOtp, 'hex');

  if (bufferA.length !== bufferB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufferA, bufferB);
};

export const generateRefreshToken = (): {
  rawRefreshToken: string;
  hashedRefreshToken: string;
} => {
  const rawRefreshToken = crypto.randomBytes(32).toString('hex');
  const hashedRefreshToken = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
  return { rawRefreshToken, hashedRefreshToken };
};

export const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, env.accessTokenSecret, {
    expiresIn: '30m',
  });
};
