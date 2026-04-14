import express from 'express';

import { loginUser, logoutUser } from '../../../shared/auth/auth.controller.js';
import { authSchema } from '../../../shared/auth/auth.schema.js';
import { validateSchema } from '../../schema-validator.js';

export const adminAuthRoutes = express.Router();

adminAuthRoutes.post('/auth/login', validateSchema(authSchema), loginUser('admin'));

adminAuthRoutes.post('/auth/logout', logoutUser('admin'));
