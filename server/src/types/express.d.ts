import 'express';

declare global {
  namespace Express {
    interface Request {
      data?: Record<string, unknown>;
    }
  }
}

export {};
