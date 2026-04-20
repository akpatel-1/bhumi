import { z } from 'zod';

export const userKycSchema = z.object({
  pan_name: z
    .string()
    .min(2, 'Full name is required')
    .transform((val) => val.toUpperCase()),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid 10-digit phone number'),
  pan_number: z
    .string()
    .regex(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/, 'Invalid PAN format')
    .transform((val) => val.toUpperCase()),
  address: z.string().min(5, 'Full address is required'),
  district: z.string().min(2, 'District is required'),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Must be exactly 6 digits'),
});
