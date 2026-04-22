import { pool } from '@/infra/db/db.js';
import { ERROR_CONFIG } from '@/modules/error-config.js';
import { ApiError } from '@/utils/api-error.js';
import { getPresignedUrl } from '@/utils/r2-services.js';

import type { LandDetailsResponse, LandHistoryDetails, LandHistoryResponse } from './land.model.js';
import {
  findCurrentLandOwner,
  findLandHistoryByLandId,
  findUserLandByUserId,
} from './land.repository.js';

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

export const landHistoryDetails = async (
  userId: string,
  userRole: string,
  landId: string,
): Promise<LandHistoryResponse[]> => {
  if (userRole === 'user') {
    const owner = await findCurrentLandOwner(pool, landId);
    if (!owner || owner.to_user_id !== userId) {
      throw new ApiError(ERROR_CONFIG.LAND_OWNERSHIP_DENIED);
    }
  }

  const landHistory = await findLandHistoryByLandId(pool, landId);

  return landHistory.map((block, index) => ({
    block_number: index + 1,
    block_hash: block.block_hash,
    transaction_type: block.transaction_type,
    status: block.status,
    from: { name: block.from_name ?? 'Government of Chhattisgarh' },
    to: { name: block.to_name },
    timestamp: block.created_at,
  }));
};
