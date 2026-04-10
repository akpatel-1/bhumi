import express from 'express';

import { adminAuthRoutes } from './module/admin/auth/admin-auth.routes.js';

export const router = express.Router();

router.use('/admin', adminAuthRoutes);
