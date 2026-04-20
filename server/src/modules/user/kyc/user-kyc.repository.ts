import { Pool } from 'pg';

interface existingUser {
  user_id: string;
  status: string;
  rejected_reason: string;
  submitted_at: Date;
}

export const findUserKycByUserId = async (
  pool: Pool,
  userId: string,
): Promise<existingUser | null> => {
  const result = await pool.query(
    `SELECT user_id, status, rejection_reason, submitted_at FROM user_kyc
    WHERE user_id = $1
    ORDER BY submitted_at DESC
    LIMIT 1`,
    [userId],
  );
  return result.rows[0] || null;
};

interface KycData {
  pan_name: string;
  phone: string;
  address: string;
  pincode: string;
  district: string;
  pan_number: string;
}

export const insertIntoUserKyc = async (
  pool: Pool,
  userId: string,
  data: KycData,
  documentKey: string,
) => {
  await pool.query(
    `INSERT INTO user_kyc (user_id, pan_name, phone, address, pincode, district, pan_number, pan_document_key)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      userId,
      data.pan_name,
      data.phone,
      data.address,
      data.pincode,
      data.district,
      data.pan_number,
      documentKey,
    ],
  );
};
