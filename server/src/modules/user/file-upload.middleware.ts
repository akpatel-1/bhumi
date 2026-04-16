import type { Request } from 'express';
import multer, { type FileFilterCallback } from 'multer';

import { ApiError } from '@/utils/api-error.js';

import { ERROR_CONFIG } from '../error-config.js';

const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

export const upload = (): multer.Multer => {
  return multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
      if (ALLOWED_TYPES.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new ApiError(ERROR_CONFIG.FILE_TYPE_MISMATCH));
      }
    },
  });
};
