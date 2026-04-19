import { USER_AUTH_CONFIG } from '@modules/user/auth/user-auth.config.js';
import {
  logout,
  rotateSession,
  sendOtpToUser,
  verifyOtpAndAuthenticateUser,
} from '@modules/user/auth/user-auth.services.js';
import { sendResponse } from '@utils/response-helper.js';
import type { Request, Response } from 'express';

import { authHandler } from '@/utils/auth-handler.js';

export const requestUserOtp = async (req: Request, res: Response) => {
  await sendOtpToUser(req.body);
  sendResponse(res, { message: 'Please verify your email to continue' });
};

export const verifyUserOtp = async (req: Request, res: Response) => {
  const { accessToken, rawRefreshToken, data } = await verifyOtpAndAuthenticateUser(req.body);

  res.cookie(
    USER_AUTH_CONFIG.ACCESS_COOKIE_NAME,
    accessToken,
    USER_AUTH_CONFIG.ACCESS_COOKIE_OPTIONS,
  );

  res.cookie(
    USER_AUTH_CONFIG.REFRESH_COOKIE_NAME,
    rawRefreshToken,
    USER_AUTH_CONFIG.REFRESH_COOKIE_OPTIONS,
  );

  sendResponse(res, { statusCode: 200, message: 'Login successful', data });
};

export const logoutUser = authHandler(async (req, res) => {
  const refreshToken = req.cookies[USER_AUTH_CONFIG.REFRESH_COOKIE_NAME];
  await logout(req.user.id, refreshToken);

  res.clearCookie(USER_AUTH_CONFIG.ACCESS_COOKIE_NAME, USER_AUTH_CONFIG.CLEAR_COOKIE_OPTIONS);
  res.clearCookie(USER_AUTH_CONFIG.REFRESH_COOKIE_NAME, USER_AUTH_CONFIG.CLEAR_COOKIE_OPTIONS);

  sendResponse(res, { message: 'Logout successful' });
});

export const rotateUserSession = async (req: Request, res: Response) => {
  const refreshToken = req.cookies[USER_AUTH_CONFIG.REFRESH_COOKIE_NAME];
  const { accessToken, rawRefreshToken, data } = await rotateSession(refreshToken);

  res.cookie(
    USER_AUTH_CONFIG.ACCESS_COOKIE_NAME,
    accessToken,
    USER_AUTH_CONFIG.ACCESS_COOKIE_OPTIONS,
  );

  res.cookie(
    USER_AUTH_CONFIG.REFRESH_COOKIE_NAME,
    rawRefreshToken,
    USER_AUTH_CONFIG.REFRESH_COOKIE_OPTIONS,
  );

  sendResponse(res, { statusCode: 200, message: 'Login successful', data });
};

export const getUser = authHandler(async (req, res) => {
  const data = req.user;
  sendResponse(res, { message: 'Authenticated user', data });
});
