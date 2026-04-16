import express from 'express';

import { validateSchema } from '@/modules/schema-validator.js';
import { validateSession } from '@/shared/session/session-validation.middleware.js';

import { approveUserKyc, getUserKyc } from './registrar-kyc.controller.js';
import { kycQuerySchema, userIdParamSchema } from './registrar-kyc.schema.js';

export const registrarKycRoutes = express.Router();

registrarKycRoutes.get(
  '/kyc/users',
  validateSession('registrar'),
  validateSchema(kycQuerySchema, 'query'),
  getUserKyc,
);

registrarKycRoutes.patch(
  '/kyc/users/:userId/approve',
  validateSession('registrar'),
  validateSchema(userIdParamSchema, 'params'),
  approveUserKyc,
);
