import { ApiError } from '@utils/api-error.js';
import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';

export function globalErrorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    });
  }

  if (err instanceof multer.MulterError) {
    const messages: Partial<Record<multer.ErrorCode, string>> = {
      LIMIT_FILE_SIZE: 'File size exceeds allowed limit',
      LIMIT_FILE_COUNT: 'Too many files uploaded',
      LIMIT_UNEXPECTED_FILE: 'Unexpected file field',
    };

    return res.status(400).json({
      success: false,
      message: messages[err.code] ?? err.message,
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
