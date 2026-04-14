import { AUTH_CONFIG } from '@shared/auth/auth.config.js';
import { getUserSession } from '@shared/session/session.redis.js';
import type { NextFunction, Request, Response } from 'express';

import { ERROR_CONFIG } from '@/modules/error-config.js';
import { ApiError } from '@/utils/api-error.js';

export const validateSession = (role: 'admin' | 'registrar') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const sessionId = req.cookies[AUTH_CONFIG.getCookieName(role)];

    if (!sessionId) {
      throw new ApiError(ERROR_CONFIG.SESSION_EXPIRED);
    }

    const user = await getUserSession(sessionId, role);

    if (!user) {
      res.clearCookie(AUTH_CONFIG.getCookieName(role), AUTH_CONFIG.CLEAR_COOKIE_OPTIONS);
      throw new ApiError(ERROR_CONFIG.SESSION_EXPIRED);
    }

    res.locals.user = {
      id: user.userId,
      role: user.role,
    };

    next();
  };
};
