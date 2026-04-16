import 'dotenv/config';

const requiredKeys = [
  'PORT',
  'NODE_ENV',
  'FRONTEND_URL',
  'OTP_SECRET',
  'ACCESS_TOKEN_SECRET',
  'DATABASE_URL',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'EMAIL_API',
  'R2_BUCKET_NAME',
  'R2_ENDPOINT',
  'R2_ACCESS_KEY',
  'R2_SECRET_KEY',
];

for (const key of requiredKeys) {
  if (!process.env[key]) {
    throw new Error(`Missing required env variable: ${key}`);
  }
}

export const env = {
  port: process.env.PORT!,
  nodeEnv: process.env.NODE_ENV!,
  frontendUrl: process.env.FRONTEND_URL!,

  otpSecret: process.env.OTP_SECRET!,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,

  databaseUrl: process.env.DATABASE_URL!,
  upstashRedisRestUrl: process.env.UPSTASH_REDIS_REST_URL!,
  upstashRedisRestToken: process.env.UPSTASH_REDIS_REST_TOKEN!,

  emailApi: process.env.EMAIL_API!,
  r2BucketName: process.env.R2_BUCKET_NAME!,
  r2Endpoint: process.env.R2_ENDPOINT!,
  r2AccessKey: process.env.R2_ACCESS_KEY!,
  r2SecretKey: process.env.R2_SECRET_KEY!,
} as const;
