import 'dotenv/config';
import type { CookieOptions } from 'express';

import { env } from '@/config/env.js';

const isProd = env.nodeEnv === 'production';
export const AUTH_CONFIG = {
  ADMIN_COOKIE_NAME: 'admin_sid',
  REGISTRAR_COOKIE_NAME: 'registrar_sid',

  MAX_AGE: 7 * 24 * 60 * 60 * 1000,

  getCookieName: (role: 'admin' | 'registrar'): string => {
    const map: Record<string, string> = {
      admin: AUTH_CONFIG.ADMIN_COOKIE_NAME,
      registrar: AUTH_CONFIG.REGISTRAR_COOKIE_NAME,
    };
    return map[role];
  },

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
