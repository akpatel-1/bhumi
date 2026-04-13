import { pool } from '../../../infra/db/db.js';

type Admin = {
  id: string;
  email: string;
  password_hash: string;
  role: string;
};
export const findAdminByEmail = async (email: string): Promise<Admin | null> => {
  const result = await pool.query(
    `SELECT id, email, password_hash, role
      FROM users WHERE email = $1 
      AND is_active = true
      LIMIT 1`,
    [email],
  );
  return result.rows[0] || null;
};
