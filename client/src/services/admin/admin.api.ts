import type {
  GetMeResponse,
  LoginPayload,
  LoginResponse,
  SessionUser,
} from '@/types/admin/auth.types';

import { adminClient } from './admin.client';

export const adminApi = {
  login: async (data: LoginPayload) => {
    const res = await adminClient.post<LoginResponse>(
      '/admin/auth/login',
      data
    );
    return res.data;
  },

  getMe: async () => {
    const res = await adminClient.get<GetMeResponse>('/admin/auth/me');
    return {
      userId: res.data.data.id,
      role: res.data.data.role,
    } satisfies SessionUser;
  },
};
