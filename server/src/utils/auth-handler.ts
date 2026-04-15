import type { NextFunction, RequestHandler, Response } from 'express';

import type { AuthenticatedRequest } from '@/types/expres.js';

export const authHandler =
  (
    fn: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>,
  ): RequestHandler =>
  (req, res, next) =>
    fn(req as AuthenticatedRequest, res, next);
