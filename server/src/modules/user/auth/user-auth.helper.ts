import crypto from 'crypto';
import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const generateOtp = () => {
  if (!process.env.OTP_SECRET) {
    throw new Error('Missing OTP_SECRET in environment variables');
  }

  const rawOtp = crypto.randomInt(100000, 1000000);
  const hashedOtp = crypto
    .createHmac('sha256', process.env.OTP_SECRET)
    .update(rawOtp.toString())
    .digest('hex');

  return { rawOtp, hashedOtp };
};

export const generateHash = (value: string) => {
  return crypto.createHash('sha256').update(value).digest('hex');
};

export const matchOtp = (otp: string, storedOtp: string): boolean => {
  if (!process.env.OTP_SECRET) {
    throw new Error('Missing OTP_SECRET in environment variables');
  }

  const generatedHash = crypto
    .createHmac('sha256', process.env.OTP_SECRET)
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
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error('Missing ACCESS_TOKEN_SECRET in environment variables');
  }

  return jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '30m',
  });
};
