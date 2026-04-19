import { validateSchema } from '@modules/schema-validator.js';
import { getMe, loginUser, logoutUser } from '@shared/auth/auth.controller.js';
import { authSchema } from '@shared/auth/auth.schema.js';
import express from 'express';

import { validateSession } from '@/shared/session/session-validation.middleware.js';

export const registrarAuthRoutes = express.Router();

registrarAuthRoutes.post('/auth/login', validateSchema(authSchema), loginUser('registrar'));

registrarAuthRoutes.post('/auth/logout', logoutUser('registrar'));

registrarAuthRoutes.get('/auth/me', validateSession('registrar'), getMe);
