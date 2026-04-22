import { authHandler } from '@/utils/auth-handler.js';
import { sendResponse } from '@/utils/response-helper.js';

import { villageLandDetails } from './land.service.js';

export const getVillageLandDetails = authHandler(async (req, res) => {
  const district = req.query.district as string;
  const tehsil = req.query.tehsil as string;
  const village = req.query.village as string;

  const data = await villageLandDetails(district, tehsil, village);
  sendResponse(res, { data });
});
