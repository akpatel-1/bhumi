import crypto from 'crypto';
import 'dotenv/config';

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
