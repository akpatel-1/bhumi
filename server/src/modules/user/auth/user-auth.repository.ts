import type { Pool, PoolClient } from 'pg';

type User = {
  id: string;
  email: string;
  role: string;
};

export const insertUserIntoUsers = async (client: PoolClient, email: string): Promise<User> => {
  const result = await client.query(
    `
    INSERT INTO users (email, role)
    VALUES ($1, $2)
    ON CONFLICT (email) 
    DO UPDATE SET email = EXCLUDED.email
    RETURNING id, email, role`,
    [email, 'user'],
  );
  return result.rows[0];
};

export const findUserById = async (client: PoolClient, userId: string): Promise<User | null> => {
  const result = await client.query(
    `SELECT id, email, role
     FROM users
     WHERE id = $1 AND role = $2 `,
    [userId, 'user'],
  );

  return result.rows[0] ?? null;
};

export const insertUserIntoRefreshTokens = async (
  client: PoolClient,
  userId: string,
  tokenHash: string,
  expireAt: Date,
) => {
  await client.query(
    `INSERT INTO refresh_tokens
    (user_id, token_hash, expires_at)
        VALUES ($1, $2, $3)`,
    [userId, tokenHash, expireAt],
  );
};

export const revokeRefreshTokenByUserId = async (pool: Pool, userId: string, tokenHash: string) => {
  await pool.query(
    `UPDATE refresh_tokens
    SET revoked_at = NOW()
    WHERE user_id = $1
    AND token_hash = $2`,
    [userId, tokenHash],
  );
};

export const revokeRefreshTokenByToken = async (
  client: PoolClient,
  token: string,
): Promise<string | null> => {
  const result = await client.query(
    `UPDATE refresh_tokens
    SET revoked_at = NOW()
    WHERE token_hash = $1
      AND revoked_at IS NULL
      AND expires_at > NOW()
    RETURNING user_id`,
    [token],
  );
  return result.rows[0]?.user_id ?? null;
};

interface Suspension {
  is_suspended: boolean;
  suspension_reason?: string;
}

export const findUserSuspension = async (
  client: PoolClient,
  userId: string,
): Promise<Suspension | null> => {
  const result = await client.query(
    `SELECT is_suspended, suspension_reason
    FROM user_profiles WHERE user_id = $1`,
    [userId],
  );
  return result.rows[0] || null;
};
