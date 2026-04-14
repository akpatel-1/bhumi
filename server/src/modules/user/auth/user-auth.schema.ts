import { z } from 'zod';

const emailValidation = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .trim()
  .toLowerCase();

export const userEmailSchema = z.object({
  email: emailValidation,
});

export const userAuthSchema = z.object({
  email: emailValidation,
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^[0-9]+$/, 'OTP must only contain numbers'),
});
