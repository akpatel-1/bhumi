import { AUTH_CONFIG } from '@shared/auth/auth.config.js';
import { authenticateUser, unauthenticateUser } from '@shared/auth/auth.services.js';
import { sendResponse } from '@utils/response-helper.js';
import type { Request, Response } from 'express';

export const loginUser = (role: 'admin' | 'registrar') => {
  return async (req: Request, res: Response) => {
    const { sessionId, data } = await authenticateUser(req.body, role);

    const cookieName =
      role === 'admin' ? AUTH_CONFIG.ADMIN_COOKIE_NAME : AUTH_CONFIG.REGISTRAR_COOKIE_NAME;

    res.cookie(cookieName, sessionId, AUTH_CONFIG.COOKIE_OPTIONS);
    sendResponse(res, { statusCode: 200, message: 'Login successful', data });
  };
};

export const logoutUser = (role: 'admin' | 'registrar') => {
  return async (req: Request, res: Response) => {
    const cookieName =
      role === 'admin' ? AUTH_CONFIG.ADMIN_COOKIE_NAME : AUTH_CONFIG.REGISTRAR_COOKIE_NAME;

    const sessionId = req.cookies[cookieName];
    await unauthenticateUser(sessionId, role);
    res.clearCookie(cookieName, AUTH_CONFIG.CLEAR_COOKIE_OPTIONS);

    sendResponse(res, { message: 'Logged out successfully' });
  };
};
