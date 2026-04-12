import express from 'express';

import { validateSchema } from '../../schema-validator.js';
import { loginAdmin, logoutAdmin } from './admin-auth.controller.js';
import { adminAuthSchema } from './admin-auth.schema.js';

export const adminAuthRoutes = express.Router();

adminAuthRoutes.post('/auth/login', validateSchema(adminAuthSchema), loginAdmin);

adminAuthRoutes.post('/auth/logout', logoutAdmin);
