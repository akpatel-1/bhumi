import type { Request, Response } from 'express';

import { sendResponse } from '../../utils/response-helper.js';
import { ADMIN_AUTH_CONFIG } from './admin-auth.config.js';
import { authenticateAdmin, unauthenticateAdmin } from './admin-auth.services.js';

export const loginAdmin = async (req: Request, res: Response) => {
  const { sessionId, data } = await authenticateAdmin(req.body);

  res.cookie(ADMIN_AUTH_CONFIG.COOKIE_NAME, sessionId, ADMIN_AUTH_CONFIG.COOKIE_OPTIONS);

  sendResponse(res, { statusCode: 200, message: 'Login successful', data });
};

export const logoutAdmin = async (req: Request, res: Response) => {
  const sessionId = req.cookies?.admin_sid;

  await unauthenticateAdmin(sessionId);

  res.clearCookie(ADMIN_AUTH_CONFIG.COOKIE_NAME, ADMIN_AUTH_CONFIG.CLEAR_COOKIE_OPTIONS);

  sendResponse(res, { message: 'Logged out successfully' });
};
