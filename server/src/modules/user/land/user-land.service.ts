import { pool } from '@/infra/db/db.js';
import { getPresignedUrl } from '@/utils/r2-services.js';

import type { UserLandDetailsResponse } from './user-land.model.js';
import { findUserLandByUserId } from './user-land.repository.js';

export const getLand = async (userId: string): Promise<UserLandDetailsResponse[]> => {
  const records = await findUserLandByUserId(pool, userId);

  const data = await Promise.all(
    records.map(async (record) => {
      const image_url = record.image_r2_key ? await getPresignedUrl(record.image_r2_key) : null;

      const { image_r2_key: _imageR2Key, ...landDetails } = record;
      return {
        ...landDetails,
        image_url,
      };
    }),
  );

  return data;
};
