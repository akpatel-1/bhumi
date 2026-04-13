import { ERROR_CONFIG } from '../../error-config.js';
import { ApiError } from '../../utils/api-error.js';
import { generateHash, generateOtp } from './user-auth.helper.js';
import { sendVerificationOtp } from './user-auth.mailer.js';
import { deleteUserOtp, storeUserOtp } from './user-auth.redis.js';

export const sendOtpToUser = async ({ email }: { email: string }) => {
  const hashedEmail = generateHash(email);
  const { rawOtp, hashedOtp } = generateOtp();
  await storeUserOtp(hashedEmail, hashedOtp);
  try {
    await sendVerificationOtp(email, rawOtp);
  } catch {
    await deleteUserOtp(hashedEmail);
    throw new ApiError(ERROR_CONFIG.EMAIL_SEND_FAILED);
  }
};
