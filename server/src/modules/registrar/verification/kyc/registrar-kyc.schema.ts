import { z } from 'zod';

export const kycQuerySchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected'], {
    message: 'Invalid status value',
  }),
});

export const userIdParamSchema = z.object({
  userId: z.string().uuid({ message: 'Invalid userId format' }),
});

export const userRejectionReason = z.object({
  rejection_reason: z
    .string({ message: 'Rejection reason is required' })
    .trim()
    .min(1, { message: 'Rejection reason is required' })
    .max(500, { message: 'Rejection reason is too long' }),
});
