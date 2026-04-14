import express from 'express';

import { loginUser, logoutUser } from '../../../shared/auth/auth.controller.js';
import { authSchema } from '../../../shared/auth/auth.schema.js';
import { validateSchema } from '../../schema-validator.js';

export const registrarAuthRoutes = express.Router();

registrarAuthRoutes.post('/auth/login', validateSchema(authSchema), loginUser('registrar'));

registrarAuthRoutes.post('/auth/logout', logoutUser('registrar'));
