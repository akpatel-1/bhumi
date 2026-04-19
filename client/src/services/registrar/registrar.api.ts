import type {
  GetMeResponse,
  LoginPayload,
  LoginResponse,
  SessionUser,
} from '@/types/admin/auth.types';

import { registrarClient } from './registrar.client';

export const registrarApi = {
  login: async (data: LoginPayload) => {
    const res = await registrarClient.post<LoginResponse>(
      '/registrar/auth/login',
      data
    );
    return res.data;
  },

  getMe: async () => {
    const res = await registrarClient.get<GetMeResponse>('/registrar/auth/me');
    return {
      userId: res.data.data.id,
      role: res.data.data.role,
    } satisfies SessionUser;
  },
};
