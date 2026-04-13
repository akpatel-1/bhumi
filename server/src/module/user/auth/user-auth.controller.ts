import type { Request, Response } from 'express';

import { sendResponse } from '../../../utils/response-helper.js';
import { USER_AUTH_CONFIG } from './user-auth.config.js';
import { sendOtpToUser, verifyOtpAndAuthenticateUser } from './user-auth.services.js';

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
