import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

import { env } from '@/config/env.js';
import { r2 } from '@/infra/r2/r2.js';

export const uploadToR2 = async (
  userId: string,
  file: Express.Multer.File,
  folder: string,
): Promise<string> => {
  const key = `${folder}/${userId}/${uuidv4()}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: env.r2BucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  return key;
};

export const deleteFromR2 = async (key: string): Promise<void> => {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: env.r2BucketName,
      Key: key,
    }),
  );
};
