import express from 'express';

import { adminAuthRoutes } from '@modules/admin/auth/admin-auth.routes.js';
import { adminRegistrarRoutes } from '@modules/admin/registrars/registrars.routes.js';
import { registrarAuthRoutes } from '@modules/registrar/auth/registrar-auth.routes.js';
import { userAuthRoutes } from '@modules/user/auth/user-auth.routes.js';

export const router = express.Router();

router.use('/admin', adminAuthRoutes);
router.use('/admin', adminRegistrarRoutes);

router.use('/registrar', registrarAuthRoutes);

router.use('/user', userAuthRoutes);
