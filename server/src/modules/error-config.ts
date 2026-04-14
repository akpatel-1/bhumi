export const ERROR_CONFIG = {
  INVALID_CREDENTIALS: {
    statusCode: 401,
    message: 'Invalid email or password',
    code: 'INVALID_CREDENTIALS',
  },
  EMAIL_SEND_FAILED: {
    statusCode: 500,
    message: 'Failed to send OTP email',
    code: 'EMAIL_SEND_FAILED',
  },
  INVALID_OR_EXPIRED_OTP: {
    statusCode: 400,
    message: 'Invalid or expired OTP',
    code: 'INVALID_OR_EXPIRED_OTP',
  },
};
