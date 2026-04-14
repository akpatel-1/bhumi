import express from 'express';

import { validateSchema } from '@/modules/schema-validator.js';
import { validateSession } from '@/shared/session/session-validation.middleware.js';

import { registrarSchema } from './registrar.schema.js';
import { createRegistrar } from './registrars.controller.js';

export const adminRegistrarRoutes = express.Router();

adminRegistrarRoutes.post(
  '/registrars/',
  validateSession('admin'),
  validateSchema(registrarSchema),
  createRegistrar,
);
