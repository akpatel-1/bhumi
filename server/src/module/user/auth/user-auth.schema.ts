import { z } from 'zod';

export const userEmailSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format').trim().toLowerCase(),
});
