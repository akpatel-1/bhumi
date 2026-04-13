import type { Request, Response } from 'express';

import { sendResponse } from '../../utils/response-helper.js';
import { sendOtpToUser } from './user-auth.services.js';

export const requestUserOtp = async (req: Request, res: Response) => {
  await sendOtpToUser(req.body);
  sendResponse(res, { message: 'Please verify your email to continue' });
};
