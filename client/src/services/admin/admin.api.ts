import type {
  GetMeResponse,
  LoginPayload,
  LoginResponse,
  SessionUser,
} from '@/types/admin/auth.types';

import { axiosClient } from './client';

export const adminApi = {
  login: async (data: LoginPayload) => {
    const res = await axiosClient.post<LoginResponse>(
      '/admin/auth/login',
      data
    );
    return res.data;
  },

  getMe: async () => {
    const res = await axiosClient.get<GetMeResponse>('/admin/auth/me');
    return {
      userId: res.data.data.id,
      role: res.data.data.role,
    } satisfies SessionUser;
  },

  logout: async () => {
    await axiosClient.post('/admin/auth/logout');
  },
};
