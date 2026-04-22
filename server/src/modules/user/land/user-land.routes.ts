import express from 'express';

import { getLandDetails } from '@/modules/user/land/user-land.controller.js';

import { validateUserSession } from '../session/user-session.middleware.js';

export const userLandRoutes = express.Router();

userLandRoutes.get('/land', validateUserSession, getLandDetails);
