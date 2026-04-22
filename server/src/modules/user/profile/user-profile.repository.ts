import type { Pool } from 'pg';

export interface UserProfileDetails {
  user_id: string;
  email: string;
  role: 'user';
  pan_name: string | null;
  phone: string | null;
  district: string | null;
  is_suspended: boolean | null;
  suspension_reason: string | null;
  created_at: Date | null;
}

export const findUserProfileByUserId = async (
  pool: Pool,
  userId: string,
): Promise<UserProfileDetails | null> => {
  const result = await pool.query<UserProfileDetails>(
    `
			SELECT
				u.id AS user_id,
				u.email,
				u.role,
				up.pan_name,
				up.phone,
				up.district,
				up.is_suspended,
				up.suspension_reason,
				up.created_at
			FROM user_profiles up
			INNER JOIN users u ON u.id = up.user_id
			WHERE up.user_id = $1
				AND u.role = 'user'
			LIMIT 1
		`,
    [userId],
  );

  return result.rows[0] ?? null;
};
