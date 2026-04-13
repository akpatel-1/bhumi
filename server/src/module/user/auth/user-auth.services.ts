import { pool } from '../../../infra/db/db.js';
import { ApiError } from '../../../utils/api-error.js';
import { withTransaction } from '../../../utils/transaction.js';
import { ERROR_CONFIG } from '../../error-config.js';
import { USER_AUTH_CONFIG } from './user-auth.config.js';
import {
  generateAccessToken,
  generateHash,
  generateOtp,
  generateRefreshToken,
  matchOtp,
} from './user-auth.helper.js';
import { sendVerificationOtp } from './user-auth.mailer.js';
import { deleteUserOtp, getUserOtp, storeUserOtp } from './user-auth.redis.js';
import { insertUserIntoRefreshTokens, insertUserIntoUsers } from './user-auth.repository.js';

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
}): Promise<{
  accessToken: string;
  rawRefreshToken: string;
  data: object;
}> => {
  const hashedEmail = generateHash(email);
  const storedOtp = await getUserOtp(hashedEmail);

  if (!storedOtp || !matchOtp(otp, storedOtp)) {
    throw new ApiError(ERROR_CONFIG.INVALID_OR_EXPIRED_OTP);
  }

  await deleteUserOtp(hashedEmail);

  const { rawRefreshToken, hashedRefreshToken } = generateRefreshToken();

  const user = await withTransaction(pool, async (client) => {
    const user = await insertUserIntoUsers(client, email);
    await insertUserIntoRefreshTokens(
      client,
      user.id,
      hashedRefreshToken,
      USER_AUTH_CONFIG.EXPIRE_AT,
    );
    return user;
  });

  const accessToken = generateAccessToken(user.id, user.role);
  return { accessToken, rawRefreshToken, data: user };
};
