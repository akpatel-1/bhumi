import { authHandler } from '@/utils/auth-handler.js';
import { sendResponse } from '@/utils/response-helper.js';

import { getRegistrar, registerRegistrar } from './registrars.service.js';

export const createRegistrar = authHandler(async (req, res) => {
  const data = await registerRegistrar(req.body, req.user.id);
  sendResponse(res, { statusCode: 201, message: 'Registrar created', data });
});

export const getAllRegistrar = authHandler(async (req, res) => {
  const data = await getRegistrar(req.user.id);
  sendResponse(res, { data });
});
