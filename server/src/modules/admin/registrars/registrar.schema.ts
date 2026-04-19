import { z } from 'zod';

export const registrarSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .toLowerCase()
    .email('Invalid email format')
    .refine((val) => val.endsWith('@gov.in'), {
      message: 'Only @gov.in emails are allowed',
    }),

  password: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .refine((val) => val.trim().length > 0, {
      message: 'Password cannot be only spaces',
    }),

  district: z.string().trim().min(2, 'District is required'),

  state: z.string().trim().min(2, 'State is required'),
});
