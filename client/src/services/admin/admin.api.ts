import type { LoginPayload, LoginResponse } from '@/types/admin/auth.types';

import { adminClient } from './admin.client';

export const adminApi = {
  login: async (data: LoginPayload) => {
    const res = await adminClient.post<LoginResponse>(
      '/admin/auth/login',
      data
    );
    return res.data;
  },
};
