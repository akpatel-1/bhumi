import express from 'express';

import { adminAuthRoutes } from './module/admin/auth/admin-auth.routes.js';
import { userAuthRoutes } from './module/user/auth/user-auth.routes.js';

export const router = express.Router();

router.use('/admin', adminAuthRoutes);

router.use('/user', userAuthRoutes);
