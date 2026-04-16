import 'dotenv/config';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '@/config/env.js';
import { ERROR_CONFIG } from '@/modules/error-config.js';
import { ApiError } from '@/utils/api-error.js';

import { USER_AUTH_CONFIG } from '../auth/user-auth.config.js';

interface JWTPayload {
  id: string;
  role: 'user';
}

export const validateUserSession = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies[USER_AUTH_CONFIG.ACCESS_COOKIE_NAME];

  if (!accessToken) {
    throw new ApiError(ERROR_CONFIG.SESSION_EXPIRED);
  }

  let payload: JWTPayload;

  try {
    payload = jwt.verify(accessToken, env.accessTokenSecret) as JWTPayload;
  } catch {
    throw new ApiError(ERROR_CONFIG.INVALID_TOKEN);
  }

  if (payload.id && payload.role === 'user') {
    req.user = {
      id: payload.id,
      role: 'user',
    };
  } else {
    throw new ApiError(ERROR_CONFIG.INVALID_TOKEN);
  }

  next();
};
