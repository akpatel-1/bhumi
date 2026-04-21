import express from 'express';

import { validateUserSession } from '../session/user-session.middleware.js';
import { getUsersLand } from './user-land.controller.js';

export const userLandRoutes = express.Router();

userLandRoutes.get('/land', validateUserSession, getUsersLand);
