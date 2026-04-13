import type { LoginPayload } from '@/types/admin/auth.types';

import { adminClient } from './admin.client';

export const adminApi = {
  login: async (data: LoginPayload) => {
    const res = await adminClient.post('/admin/auth/login', data);
    return res.data;
  },
};
