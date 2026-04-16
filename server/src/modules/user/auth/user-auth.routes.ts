import { validateSchema } from '@modules/schema-validator.js';
import {
  logoutUser,
  requestUserOtp,
  verifyUserOtp,
} from '@modules/user/auth/user-auth.controller.js';
import { userAuthSchema, userEmailSchema } from '@modules/user/auth/user-auth.schema.js';
import express from 'express';

import { validateUserSession } from '../session/user-session.middleware.js';

export const userAuthRoutes = express.Router();

userAuthRoutes.post('/auth/request-otp', validateSchema(userEmailSchema), requestUserOtp);

userAuthRoutes.post('/auth/verify-otp', validateSchema(userAuthSchema), verifyUserOtp);

userAuthRoutes.post('/auth/logout', validateUserSession, logoutUser);
