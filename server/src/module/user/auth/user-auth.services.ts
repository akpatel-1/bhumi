import { ERROR_CONFIG } from '../../error-config.js';
import { ApiError } from '../../utils/api-error.js';
import { generateHash, generateOtp, matchOtp } from './user-auth.helper.js';
import { sendVerificationOtp } from './user-auth.mailer.js';
import { deleteUserOtp, getUserOtp, storeUserOtp } from './user-auth.redis.js';

export const sendOtpToUser = async ({ email }: { email: string }) => {
  const hashedEmail = generateHash(email);
  const { rawOtp, hashedOtp } = generateOtp();
  await storeUserOtp(hashedEmail, hashedOtp);
  try {
    // await sendVerificationOtp(email, rawOtp);
    console.log(rawOtp);
  } catch {
    await deleteUserOtp(hashedEmail);
    throw new ApiError(ERROR_CONFIG.EMAIL_SEND_FAILED);
  }
};

export const verifyOtpAndAuthenticateUser = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) => {
  const hashedEmail = generateHash(email);
  const storedOtp = await getUserOtp(hashedEmail);

  if (!storedOtp || !matchOtp(otp, storedOtp)) {
    throw new ApiError(ERROR_CONFIG.INVALID_OR_EXPIRED_OTP);
  }

  await deleteUserOtp(hashedEmail);
};
