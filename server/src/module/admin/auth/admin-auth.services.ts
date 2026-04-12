import argon2 from 'argon2';

import { ERROR_CONFIG } from '../../error-config.js';
import { ApiError } from '../../utils/api-error.js';
import { createAdminSession, deleteAdminSession } from '../session/admin-session.repository.js';
import { findAdminByEmail } from './admin-auth.repository.js';

export const authenticateAdmin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const admin = await findAdminByEmail(email);

  if (!admin) {
    throw new ApiError(ERROR_CONFIG.INVALID_CREDENTIALS);
  }

  const isMatch = await argon2.verify(admin.password_hash, password);

  if (!isMatch) {
    throw new ApiError(ERROR_CONFIG.INVALID_CREDENTIALS);
  }

  const sessionId = await createAdminSession(admin.id, admin.role);

  return {
    sessionId,
    data: {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    },
  };
};

export const unauthenticateAdmin = async (sessionId?: string) => {
  if (!sessionId) return;
  return deleteAdminSession(sessionId);
};
