import { authHandler } from '@/utils/auth-handler.js';
import { sendResponse } from '@/utils/response-helper.js';

import { approveKyc, getKyc } from './registrar-kyc.service.js';

export const getUserKyc = authHandler(async (req, res) => {
  const status = req.query.status as string;
  const data = await getKyc(req.user.id, status);
  sendResponse(res, { data });
});

export const approveUserKyc = authHandler(async (req, res) => {
  const userId = req.params.userId as string;
  await approveKyc(userId, req.user.id);
  sendResponse(res, { statusCode: 201, message: 'KYC approved successfully' });
});
