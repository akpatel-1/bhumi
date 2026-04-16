import { authHandler } from '@/utils/auth-handler.js';
import { sendResponse } from '@/utils/response-helper.js';

import { submitKyc } from './user-kyc.service.js';

export const submitUserKyc = authHandler(async (req, res) => {
  await submitKyc(req.body, req.file!, req.user.id);
  sendResponse(res, { statusCode: 201, message: 'KYC submitted successfully' });
});
