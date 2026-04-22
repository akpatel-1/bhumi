import { authHandler } from '@/utils/auth-handler.js';
import { sendResponse } from '@/utils/response-helper.js';

import { getUserProfileDetails } from './user-profile.services.js';

export const getUserProfile = authHandler(async (req, res) => {
  const data = await getUserProfileDetails(req.user.id);
  sendResponse(res, { data });
});
