import { authHandler } from '@/utils/auth-handler.js';
import { sendResponse } from '@/utils/response-helper.js';

import { getLand } from './user-land.service.js';

export const getUsersLand = authHandler(async (req, res) => {
  const data = await getLand(req.user.id);
  sendResponse(res, { data });
});
