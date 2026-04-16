import { authHandler } from '@/utils/auth-handler.js';
import { sendResponse } from '@/utils/response-helper.js';

import { approveKyc, getKyc, rejectKyc } from './registrar-kyc.service.js';

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

export const rejectUserKyc = authHandler(async (req, res) => {
  const userId = req.params.userId as string;
  const rejectionReason = req.body.rejection_reason as string;

  await rejectKyc(userId, req.user.id, rejectionReason);
  sendResponse(res, { statusCode: 200, message: 'KYC rejected successfully' });
});
