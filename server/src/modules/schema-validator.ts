import { ApiError } from '@utils/api-error.js';
import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

export function validateSchema(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message;

      throw new ApiError({
        statusCode: 400,
        message: firstError || 'Validation Error',
        code: 'VALIDATION_ERROR',
      });
    }

    req[source] = result.data;

    next();
  };
}
