import { validateSchema } from '@modules/schema-validator.js';
import { loginUser, logoutUser } from '@shared/auth/auth.controller.js';
import { authSchema } from '@shared/auth/auth.schema.js';
import express from 'express';

export const registrarAuthRoutes = express.Router();

registrarAuthRoutes.post('/auth/login', validateSchema(authSchema), loginUser('registrar'));

registrarAuthRoutes.post('/auth/logout', logoutUser('registrar'));
