import type { Pool, PoolClient } from 'pg';

interface User {
  id: string;
  email: string;
}

export const findRegistrarByEmail = async (pool: Pool, email: string): Promise<User | null> => {
  const result = await pool.query(
    `
    SELECT id, email 
    FROM users 
    WHERE email = $1
    AND role = $2 
    AND is_active = true`,
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
  createdBy: string;
}

interface RegistrarProfile {
  district: string;
  created_at: Date;
}
export const insertIntoRegistrarProfile = async (
  client: PoolClient,
  data: RegistrarData,
): Promise<RegistrarProfile> => {
  const result = await client.query(
    `INSERT INTO registrar_profiles
        (user_id, district, created_by)
        VALUES($1, $2, $3)
        RETURNING district, created_at`,
    [data.userId, data.district, data.createdBy],
  );
  return result.rows[0];
};
