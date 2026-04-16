import argon2 from 'argon2';

import { pool } from '@/infra/db/db.js';
import { ERROR_CONFIG } from '@/modules/error-config.js';
import { ApiError } from '@/utils/api-error.js';
import { withTransaction } from '@/utils/transaction.js';

import {
  findRegistrarByEmail,
  insertIntoRegistrarProfile,
  insertIntoUsers,
} from './registrars.repository.js';

interface Credentials {
  email: string;
  password: string;
  district: string;
  state: string;
}

interface RegistrarResponse {
  id: string;
  email: string;
  district: string;
  state: string;
  createdAt: Date;
}

export const registerRegistrar = async (
  credentials: Credentials,
  id: string,
): Promise<RegistrarResponse> => {
  const { email, password, district, state } = credentials;
  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
  });
  const existing = await findRegistrarByEmail(pool, email);

  if (existing) {
    throw new ApiError(ERROR_CONFIG.REGISTRAR_ALREADY_EXISTS);
  }

  return await withTransaction(pool, async (client) => {
    const user = await insertIntoUsers(client, { email, passwordHash });
    const profile = await insertIntoRegistrarProfile(client, {
      userId: user.id,
      district,
      state,
      createdBy: id,
    });
    return {
      id: user.id,
      email: user.email,
      district: profile.district,
      state: profile.state,
      createdAt: profile.created_at,
    };
  });
};
