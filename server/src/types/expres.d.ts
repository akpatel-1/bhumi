import type { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: 'admin' | 'registrar' | 'user' };
    }
  }
}

export type AuthenticatedRequest = Request & {
  user: { id: string; role: 'admin' | 'registrar' | 'user' };
};
