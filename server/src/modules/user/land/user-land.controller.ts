import { authHandler } from '@/utils/auth-handler.js';
import { sendResponse } from '@/utils/response-helper.js';

import { landDetails, landHistoryDetails } from '../../shared/land/land.service.js';

export const getLandDetails = authHandler(async (req, res) => {
  const data = await landDetails(req.user.id);
  sendResponse(res, { data });
});

export const getLandHistoryDetails = authHandler(async (req, res) => {
  const data = await landHistoryDetails(req.user.id, req.user.role, req.params.landId as string);
  sendResponse(res, { data });
});
