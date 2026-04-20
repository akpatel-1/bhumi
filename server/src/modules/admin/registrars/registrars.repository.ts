import type { Pool, PoolClient } from 'pg';

interface User {
  id: string;
  email: string;
}

export const findRegistrarByEmail = async (pool: Pool, email: string): Promise<User | null> => {
  const result = await pool.query(
    `
    SELECT rp.user_id 
    FROM registrar_profiles rp
    JOIN users u ON u.id = rp.user_id 
    WHERE u.email = $1
    AND u.role = $2
    LIMIT 1
    `,
    [email, 'registrar'],
  );

  return result.rows[0] || null;
};

interface Credentials {
  email: string;
  passwordHash: string;
}

export const insertIntoUsers = async (
  client: PoolClient,
  credentials: Credentials,
): Promise<User> => {
  const result = await client.query(
    `
        INSERT INTO users 
        (email, password_hash, role)
        VALUES ($1, $2, $3)
        RETURNING id, email`,
    [credentials.email, credentials.passwordHash, 'registrar'],
  );
  return result.rows[0];
};

interface RegistrarData {
  userId: string;
  district: string;
  state: string;
  createdBy: string;
}

interface RegistrarProfile {
  district: string;
  state: string;
  created_at: Date;
}
export const insertIntoRegistrarProfile = async (
  client: PoolClient,
  data: RegistrarData,
): Promise<RegistrarProfile> => {
  const result = await client.query(
    `INSERT INTO registrar_profiles
        (user_id, district, state, created_by)
        VALUES($1, $2, $3, $4)
        RETURNING district, state, created_at`,
    [data.userId, data.district, data.state, data.createdBy],
  );
  return result.rows[0];
};
