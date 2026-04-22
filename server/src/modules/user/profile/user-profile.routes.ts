import express from 'express';

import { validateUserSession } from '../session/user-session.middleware.js';
import { getUserProfile } from './user-profile.controller.js';

export const userProfileRoutes = express.Router();

userProfileRoutes.get('/profile', validateUserSession, getUserProfile);
