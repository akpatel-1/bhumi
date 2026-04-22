import { authHandler } from '@/utils/auth-handler.js';
import { sendResponse } from '@/utils/response-helper.js';

import { landDetails } from '../../shared/land/land.service.js';

export const getLandDetails = authHandler(async (req, res) => {
  const data = await landDetails(req.user.id);
  sendResponse(res, { data });
});
