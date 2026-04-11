import type { Request, Response } from 'express';

import { sendResponse } from '../../utils/response-helper.js';
import { ADMIN_AUTH_CONFIG } from './admin-auth.config.js';
import { service } from './admin-auth.services.js';

export const controller = {
  loginAdmin: async (req: Request, res: Response) => {
    const { sessionId, data } = await service.authenticateAdmin(req.body);

    res.cookie(ADMIN_AUTH_CONFIG.COOKIE_NAME, sessionId, ADMIN_AUTH_CONFIG.COOKIE_OPTIONS);
    
    sendResponse(res, { statusCode: 200, message: 'Login successful', data });
  },
};
