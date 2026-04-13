import express from 'express';

import { validateSchema } from '../../schema-validator.js';
import { requestUserOtp, verifyUserOtp } from './user-auth.controller.js';
import { userAuthSchema, userEmailSchema } from './user-auth.schema.js';

export const userAuthRoutes = express.Router();

userAuthRoutes.post('/auth/request-otp', validateSchema(userEmailSchema), requestUserOtp);

userAuthRoutes.post('/auth/verify-otp', validateSchema(userAuthSchema), verifyUserOtp);
