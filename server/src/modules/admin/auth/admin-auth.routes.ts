import express from 'express';

import { validateSchema } from '@/modules/schema-validator.js';
import { loginUser, logoutUser } from '@/shared/auth/auth.controller.js';
import { authSchema } from '@/shared/auth/auth.schema.js';

export const adminAuthRoutes = express.Router();

adminAuthRoutes.post('/auth/login', validateSchema(authSchema), loginUser('admin'));

adminAuthRoutes.post('/auth/logout', logoutUser('admin'));
