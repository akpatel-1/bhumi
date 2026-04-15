import type { Request, Response } from 'express';

import { ERROR_CONFIG } from '@/modules/error-config.js';
import { ApiError } from '@/utils/api-error.js';
import { sendResponse } from '@/utils/response-helper.js';

import { registerRegistrar } from './registrars.service.js';

export const createRegistrar = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(ERROR_CONFIG.UNAUTHORIZED);
  }

  const data = await registerRegistrar(req.body, req.user.id);
  sendResponse(res, { statusCode: 201, message: 'Registrar created', data });
};
