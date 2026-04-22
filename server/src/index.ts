import { adminAuthRoutes } from '@modules/admin/auth/admin-auth.routes.js';
import { adminRegistrarRoutes } from '@modules/admin/registrars/registrars.routes.js';
import { registrarAuthRoutes } from '@modules/registrar/auth/registrar-auth.routes.js';
import { userAuthRoutes } from '@modules/user/auth/user-auth.routes.js';
import { userKycRoutes } from '@modules/user/kyc/user-kyc.routes.js';
import { userLandRoutes } from '@modules/user/land/user-land.routes.js';
import { userProfileRoutes } from '@modules/user/profile/user-profile.routes.js';
import express from 'express';

import { registrarKycRoutes } from './modules/registrar/verification/kyc/registrar-kyc.routes.js';

export const router = express.Router();

router.use('/admin', adminAuthRoutes);
router.use('/admin', adminRegistrarRoutes);

router.use('/registrar', registrarAuthRoutes);
router.use('/registrar', registrarKycRoutes);

router.use('/user', userAuthRoutes);
router.use('/user', userKycRoutes);
router.use('/user', userLandRoutes);
router.use('/user', userProfileRoutes);
