import express from 'express';

import { validateSchema } from '../../schema-validator.js';
import { controller } from './admin-auth.controller.js';
import { adminAuthSchema } from './admin-auth.schema.js';

export const adminAuthRoutes = express.Router();

adminAuthRoutes.post('/auth/login', validateSchema(adminAuthSchema), controller.loginAdmin);

adminAuthRoutes.post('/auth/logout', controller.logoutAdmin);
