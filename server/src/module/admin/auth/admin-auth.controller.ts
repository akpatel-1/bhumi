import type { Request, Response } from 'express';

import { sendResponse } from '../../utils/response-helper.js';
import { service } from './admin-auth.services.js';

export const controller = {
  loginAdmin: async (req: Request, res: Response) => {
    const data = await service.authenticateAdmin(req.body);
    sendResponse(res, { statusCode: 200, message: 'Login successful', data });
  },
};
