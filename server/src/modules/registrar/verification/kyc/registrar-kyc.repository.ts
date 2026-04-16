import type { Pool, PoolClient } from 'pg';

interface UserKyc {
  user_id: string;
  pan_name: string;
  phone: string;
  address: string;
  pincode: string;
  district: string;
  state: string;
  pan_number: string;
  pan_document_key: string;
}

export const fetchUsersKyc = async (
  pool: Pool,
  userId: string,
  status: string,
): Promise<UserKyc[]> => {
  const result = await pool.query(
    `SELECT uk.user_id, uk.phone, uk.address, uk.pincode,
            uk.district, uk.state, uk.pan_number
     FROM user_kyc uk
     JOIN registrar_profiles rp 
       ON rp.district = uk.district 
      AND rp.state = uk.state
     WHERE rp.user_id = $1
       AND uk.status = $2`,
    [userId, status],
  );
  return result.rows;
};

interface userProfile {
  user_id: string;
  pan_name: string;
  phone: string;
  district: string;
  state: string;
}

export const updateUserKyc = async (
  client: PoolClient,
  userId: string,
  reviewerId: string,
): Promise<userProfile> => {
  const result = await client.query(
    `
    UPDATE user_kyc
    SET status = 'approved',
        reviewed_at = NOW(),
        reviewed_by = $2
    WHERE user_id = $1 
    AND status = 'pending'
    RETURNING user_id, pan_name, phone, district, state;
`,
    [userId, reviewerId],
  );
  return result.rows[0];
};

export const insertIntoUserProfile = async (client: PoolClient, data: userProfile) => {
  await client.query(`
    INSERT INTO user_profiles 
    (user_id, pan_name, phone, district, state)
    VALUES ($1, $2, $3, $4, $5)
    `);
};
