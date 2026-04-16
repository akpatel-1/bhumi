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

export const revokeRefreshTokenByUserId = async (pool: Pool, userId: string) => {
  await pool.query(
    `UPDATE refresh_tokens
    SET revoked_at = NOW()
    WHERE user_id = $1`,
    [userId],
  );
};
