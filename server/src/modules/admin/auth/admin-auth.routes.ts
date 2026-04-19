import express from 'express';

import { validateSchema } from '@/modules/schema-validator.js';
import { getMe, loginUser, logoutUser } from '@/shared/auth/auth.controller.js';
import { authSchema } from '@/shared/auth/auth.schema.js';
import { validateSession } from '@/shared/session/session-validation.middleware.js';

export const adminAuthRoutes = express.Router();

adminAuthRoutes.post('/auth/login', validateSchema(authSchema), loginUser('admin'));

adminAuthRoutes.post('/auth/logout', logoutUser('admin'));

adminAuthRoutes.get('/auth/me', validateSession('admin'), getMe);
