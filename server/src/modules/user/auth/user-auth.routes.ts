import { validateSchema } from '@modules/schema-validator.js';
import { requestUserOtp, verifyUserOtp } from '@modules/user/auth/user-auth.controller.js';
import { userAuthSchema, userEmailSchema } from '@modules/user/auth/user-auth.schema.js';
import express from 'express';

export const userAuthRoutes = express.Router();

userAuthRoutes.post('/auth/request-otp', validateSchema(userEmailSchema), requestUserOtp);

userAuthRoutes.post('/auth/verify-otp', validateSchema(userAuthSchema), verifyUserOtp);
