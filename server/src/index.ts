import express from 'express';

import { adminAuthRoutes } from './modules/admin/auth/admin-auth.routes.js';
import { userAuthRoutes } from './modules/user/auth/user-auth.routes.js';

export const router = express.Router();

router.use('/admin', adminAuthRoutes);

router.use('/user', userAuthRoutes);
