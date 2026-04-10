import type { NextFunction, Request, Response } from 'express';

import { ApiError } from './utils/api-error.js';

export function globalErrorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    });
  }

  if (err instanceof Error) {
    console.error('Error Details:', {
      url: req.url,
      error: err.message,
      type: err.constructor.name,
    });
  } else {
    console.error('Unknown Error:', err);
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error. Please try again after a while.',
    code: 'INTERNAL_ERROR',
  });
}
