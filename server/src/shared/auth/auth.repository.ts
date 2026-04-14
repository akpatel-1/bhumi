import { pool } from '@infra/db/db.js';

type User = {
  id: string;
  email: string;
  password_hash: string;
  role: string;
};

export const findUserByEmail = async (email: string, role: string): Promise<User | null> => {
  const result = await pool.query(
    `SELECT id, email, password_hash, role
      FROM users 
      WHERE email = $1 
      AND role = $2
      AND is_active = true
      LIMIT 1`,
    [email, role],
  );
  return result.rows[0] || null;
};
