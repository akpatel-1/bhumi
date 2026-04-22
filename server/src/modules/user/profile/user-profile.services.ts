import { pool } from '@/infra/db/db.js';
import { ApiError } from '@/utils/api-error.js';

import { findUserProfileByUserId } from './user-profile.repository.js';

export const getUserProfileDetails = async (userId: string) => {
  const profile = await findUserProfileByUserId(pool, userId);

  if (!profile) {
    throw new ApiError({
      statusCode: 404,
      message: 'User profile not found.',
      code: 'USER_PROFILE_NOT_FOUND',
    });
  }

  return profile;
};
