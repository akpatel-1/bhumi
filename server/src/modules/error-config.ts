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
  SESSION_EXPIRED: {
    statusCode: 401,
    message: 'Your session has expired, please login again',
    code: 'SESSION_EXPIRED',
  },
  REGISTRAR_ALREADY_EXISTS: {
    statusCode: 409,
    message: 'Registrar already exists',
    code: 'REGISTRAR_ALREADY_EXISTS',
  },
};
