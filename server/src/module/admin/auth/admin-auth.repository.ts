export const repository = {
  getAdminByEmail: async (client, email: string) => {
    const result = await client.query(
      `SELECT id, email, password_hash, role
      FROM users WHERE email = $1 
      AND is_active = true
      LIMIT 1`,
      [email],
    );
    return result.rows[0];
  },
};
