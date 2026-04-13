import express from 'express';

import { validateSchema } from '../../schema-validator.js';
import { requestUserOtp } from './user-auth.controller.js';
import { userEmailSchema } from './user-auth.schema.js';

export const userAuthRoutes = express.Router();

userAuthRoutes.post('/auth/request-otp', validateSchema(userEmailSchema), requestUserOtp);
