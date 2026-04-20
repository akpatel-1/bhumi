import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').toLowerCase().email('Invalid email format'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine((val) => val.trim().length > 0, {
      message: 'Password cannot be only spaces',
    }),
});
