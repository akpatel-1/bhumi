import type { NextFunction, Request, Response } from 'express';

import { ERROR_CONFIG } from '@/modules/error-config.js';
import { ApiError } from '@/utils/api-error.js';

export const validateKycFile = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    throw new ApiError(ERROR_CONFIG.DOCUMENT_REQUIRED);
  }
  next();
};
