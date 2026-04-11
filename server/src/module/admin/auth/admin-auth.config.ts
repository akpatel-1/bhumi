import 'dotenv/config';
import type { CookieOptions } from 'express';

const isProd = process.env.NODE_ENV === 'production';
export const ADMIN_AUTH_CONFIG = {
  COOKIE_NAME: 'admin_sid',
  MAX_AGE: 7 * 24 * 60 * 60 * 1000,

  get COOKIE_OPTIONS(): CookieOptions {
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: this.MAX_AGE,
    };
  },

  get CLEAR_COOKIE_OPTIONS(): CookieOptions {
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
    };
  },
};
