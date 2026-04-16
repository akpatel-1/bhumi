import express from 'express';

import { validateSchema } from '@/modules/schema-validator.js';

import { upload } from '../file-upload.middleware.js';
import { validateUserSession } from '../session/user-session.middleware.js';
import { validateKycFile } from './user-kyc-middleware.js';
import { submitUserKyc, userKycStatus } from './user-kyc.controller.js';
import { userKycSchema } from './user-kyc.schema.js';

export const userKycRoutes = express.Router();

userKycRoutes.post(
  '/kyc',
  validateUserSession,
  upload().single('pan_document'),
  validateKycFile,
  validateSchema(userKycSchema),
  submitUserKyc,
);

userKycRoutes.get('/kyc/status', validateUserSession, userKycStatus);
