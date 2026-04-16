import { S3Client } from '@aws-sdk/client-s3';

import { env } from '@/config/env.js';

export const r2 = new S3Client({
  region: 'auto',
  endpoint: env.r2Endpoint,
  credentials: {
    accessKeyId: env.r2AccessKey,
    secretAccessKey: env.r2SecretKey,
  },
});
