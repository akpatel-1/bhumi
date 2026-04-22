import { z } from 'zod';

export const landHistoryParamSchema = z.object({
  landId: z.string().uuid('Invalid land ID'),
});

export const villageLandSearchQuery = z.object({
  district: z.string().trim().min(1, 'District is required'),
  tehsil: z.string().trim().min(1, 'Tehsil is required'),
  village: z.string().trim().min(1, 'Village is required'),
});
