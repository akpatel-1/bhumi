import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

import { ApiError } from './utils/api-error.js';

export function validateSchema(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data = req[source] || {};

    const result = schema.safeParse(data);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message;

      throw new ApiError({
        statusCode: 400,
        message: firstError || 'Validation Error',
        code: 'VALIDATION_ERROR',
      });
    }

    req.data = Object.assign(req.data || {}, result.data);

    next();
  };
}
