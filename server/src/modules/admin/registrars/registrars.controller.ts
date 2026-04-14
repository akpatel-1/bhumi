import type { Request, Response } from 'express';

import { sendResponse } from '@/utils/response-helper.js';

import { registerRegistrar } from './registrars.service.js';

export const createRegistrar = async (req: Request, res: Response) => {
  const data = await registerRegistrar(req.body, res.locals.user);
  sendResponse(res, { statusCode: 201, message: 'Registrar created', data });
};
