import express from 'express';

import { validateSchema } from '@/modules/schema-validator.js';
import { landHistoryParamSchema } from '@/modules/shared/land/land.schema.js';
import { getLandDetails, getLandHistoryDetails } from '@/modules/user/land/user-land.controller.js';

import { validateUserSession } from '../session/user-session.middleware.js';

export const userLandRoutes = express.Router();

userLandRoutes.get('/land', validateUserSession, getLandDetails);

userLandRoutes.get(
  '/land/:landId/history',
  validateUserSession,
  validateSchema(landHistoryParamSchema, 'params'),
  getLandHistoryDetails,
);
