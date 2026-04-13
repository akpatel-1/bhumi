import type { Request, Response } from 'express';

import { sendResponse } from '../../utils/response-helper.js';
import { sendOtpToUser, verifyOtpAndAuthenticateUser } from './user-auth.services.js';

export const requestUserOtp = async (req: Request, res: Response) => {
  await sendOtpToUser(req.body);
  sendResponse(res, { message: 'Please verify your email to continue' });
};

export const verifyUserOtp = async (req: Request, res: Response) => {
  await verifyOtpAndAuthenticateUser(req.body);
  sendResponse(res, { statusCode: 201, message: 'Login successful' });
};
