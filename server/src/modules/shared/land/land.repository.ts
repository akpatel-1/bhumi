import type { Pool } from 'pg';

import type { LandDetails, LandHistoryDetails, VillageLandRecord } from './land.model.js';

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

export const findCurrentLandOwner = async (
  pool: Pool,
  landId: string,
): Promise<{ to_user_id: string } | null> => {
  const result = await pool.query(
    `SELECT to_user_id FROM land_transactions
     WHERE land_id = $1 AND status = 'approved'
     ORDER BY created_at DESC
     LIMIT 1`,
    [landId],
  );
  return result.rows[0] ?? null;
};

export const findLandHistoryByLandId = async (
  pool: Pool,
  landId: string,
): Promise<LandHistoryDetails[]> => {
  const result = await pool.query<LandHistoryDetails>(
    `SELECT
       bb.block_hash,
       bb.previous_hash,
       bb.payload,
       bb.created_at,
       lt.transaction_type,
       lt.status,
       from_user.id as from_user_id,
       up_from.pan_name as from_name,
       to_user.id as to_user_id,
       up_to.pan_name as to_name
     FROM blockchain_blocks bb
     JOIN land_transactions lt ON lt.id = bb.transaction_id
     JOIN users from_user ON from_user.id = lt.from_user_id
     JOIN users to_user ON to_user.id = lt.to_user_id
     LEFT JOIN user_profiles up_from ON up_from.user_id = from_user.id
     LEFT JOIN user_profiles up_to ON up_to.user_id = to_user.id
     WHERE bb.land_id = $1
     ORDER BY bb.created_at ASC`,
    [landId],
  );
  return result.rows;
};

export const findVillageLands = async (
  pool: Pool,
  district: string,
  tehsil: string,
  village: string,
): Promise<VillageLandRecord[]> => {
  const result = await pool.query<VillageLandRecord>(
    `SELECT
       lr.id AS land_id,
       lr.plot_no,
       lr.district,
       lr.tehsil,
       lr.village,
       lr.area_sqm::text,
       lr.land_type,
       lr.image_r2_key
     FROM land_records lr
     WHERE lower(lr.district) = lower($1)
       AND lower(lr.tehsil) = lower($2)
       AND lower(lr.village) = lower($3)
     ORDER BY lr.created_at DESC`,
    [district, tehsil, village],
  );

  return result.rows;
};
