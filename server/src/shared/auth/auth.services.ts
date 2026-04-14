import argon2 from 'argon2';

import { ERROR_CONFIG } from '../../modules/error-config.js';
import { ApiError } from '../../utils/api-error.js';
import { createUserSession, deleteUserSession } from '../session/session.redis.js';
import { findUserByEmail } from './auth.repository.js';

interface AuthCredentials {
  email: string;
  password: string;
}

export const authenticateUser = async (credentials: AuthCredentials, role: string) => {
  const { email, password } = credentials;

  const user = await findUserByEmail(email, role);

  if (!user) {
    throw new ApiError(ERROR_CONFIG.INVALID_CREDENTIALS);
  }

  const isMatch = await argon2.verify(user.password_hash, password);

  if (!isMatch) {
    throw new ApiError(ERROR_CONFIG.INVALID_CREDENTIALS);
  }

  const sessionId = await createUserSession(user.id, user.role);

  return {
    sessionId,
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};

export const unauthenticateUser = async (sessionId: string | undefined, role: string) => {
  if (!sessionId) return;
  return deleteUserSession(sessionId, role);
};
