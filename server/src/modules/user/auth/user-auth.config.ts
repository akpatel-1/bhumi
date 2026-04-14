import type { CookieOptions } from 'express';

const isProd = process.env.NODE_ENV === 'production';

export const USER_AUTH_CONFIG = {
  OTP_PREFIX: 'user:otp:',
  OTP_TTL: 10 * 60,

  EXPIRE_AT: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  ACCESS_COOKIE_NAME: 'user_aid',
  REFRESH_COOKIE_NAME: 'user_rid',
  ACCESS_MAX_AGE: 15 * 60 * 1000,
  REFRESH_MAX_AGE: 30 * 24 * 60 * 60 * 1000,

  get ACCESS_COOKIE_OPTIONS(): CookieOptions {
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: this.ACCESS_MAX_AGE,
    };
  },

  get REFRESH_COOKIE_OPTIONS(): CookieOptions {
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: this.REFRESH_MAX_AGE,
    };
  },
};
