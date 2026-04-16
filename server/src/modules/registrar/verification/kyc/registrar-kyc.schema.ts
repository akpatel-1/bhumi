import { z } from 'zod';

export const kycQuerySchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected'], {
    message: 'Invalid status value',
  }),
});

export const userIdParamSchema = z.object({
  userId: z.string().uuid({ message: 'Invalid userId format' }),
});
