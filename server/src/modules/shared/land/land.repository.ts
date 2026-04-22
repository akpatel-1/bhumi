import type { Pool } from 'pg';

import type { LandDetails } from './land.model.js';

export const findUserLandByUserId = async (pool: Pool, userId: string): Promise<LandDetails[]> => {
  const result = await pool.query<LandDetails>(
    `
      WITH latest_approved_transactions AS (
        SELECT
          lt.land_id,
          lt.to_user_id,
          lt.transaction_type,
          lt.created_at,
          ROW_NUMBER() OVER (
            PARTITION BY lt.land_id
            ORDER BY lt.created_at DESC, lt.id DESC
          ) AS rank
        FROM land_transactions lt
        WHERE lt.status = 'approved'
      )
      SELECT
        lr.id AS land_id,
        lr.plot_no,
        lr.district,
        lr.tehsil,
        lr.village,
        lr.area_sqm::text,
        lr.land_type,
        lr.image_r2_key,
        lat.created_at AS acquired_at,
        lat.transaction_type
      FROM latest_approved_transactions lat
      INNER JOIN land_records lr ON lr.id = lat.land_id
      WHERE lat.rank = 1
        AND lat.to_user_id = $1
      ORDER BY lat.created_at DESC
    `,
    [userId],
  );

  return result.rows;
};
