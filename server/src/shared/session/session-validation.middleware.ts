import { AUTH_CONFIG } from '@shared/auth/auth.config.js';
import { getUserSession } from '@shared/session/session.redis.js';
import type { NextFunction, Request, Response } from 'express';

import { ERROR_CONFIG } from '@/modules/error-config.js';
import { ApiError } from '@/utils/api-error.js';

export const validateSession = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const cookieName =
      role === 'admin' ? AUTH_CONFIG.ADMIN_COOKIE_NAME : AUTH_CONFIG.REGISTRAR_COOKIE_NAME;
    const sessionId = req.cookies[cookieName];

    if (!sessionId) {
      throw new ApiError(ERROR_CONFIG.SESSION_EXPIRED);
    }

    const user = await getUserSession(sessionId, role);

    if (!user) {
      res.clearCookie(cookieName, AUTH_CONFIG.CLEAR_COOKIE_OPTIONS);
      throw new ApiError(ERROR_CONFIG.SESSION_EXPIRED);
    }

    res.locals.user = {
      id: user.userId,
      role: user.role,
    };

    next();
  };
};
