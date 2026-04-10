import argon2 from 'argon2';

import { pool } from '../../../infra/db/db.js';
import { ERROR_CONFIG } from '../../error-config.js';
import { ApiError } from '../../utils/api-error.js';
import { repository } from './admin-auth.repository.js';

export const service = {
  authenticateAdmin: async ({ email, password }: { email: string; password: string }) => {
    const admin = await repository.getAdminByEmail(pool, email);

    if (!admin) {
      throw new ApiError(ERROR_CONFIG.INVALID_CREDENTIALS);
    }

    const isMatch = await argon2.verify(admin.password_hash, password);

    if (!isMatch) {
      throw new ApiError(ERROR_CONFIG.INVALID_CREDENTIALS);
    }

    return {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    };
  },
};
