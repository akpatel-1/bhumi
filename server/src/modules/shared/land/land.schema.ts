import { z } from 'zod';

export const landHistoryParamSchema = z.object({
  landId: z.string().uuid('Invalid land ID'),
});
