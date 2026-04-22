import { pool } from '@/infra/db/db.js';
import { getPresignedUrl } from '@/utils/r2-services.js';

import type { LandDetailsResponse } from './land.model.js';
import { findUserLandByUserId } from './land.repository.js';

export const landDetails = async (userId: string): Promise<LandDetailsResponse[]> => {
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
