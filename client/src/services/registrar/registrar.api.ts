import type {
  GetMeResponse,
  LoginPayload,
  LoginResponse,
  SessionUser,
} from '@/types/admin/auth.types';
import type {
  RegistrarGetUserKycResponse,
  RegistrarKycStatus,
} from '@/types/registrar/registrar.kyc.types';

import { axiosClient } from '../admin/client';

export const registrarApi = {
  login: async (data: LoginPayload) => {
    const res = await axiosClient.post<LoginResponse>(
      '/registrar/auth/login',
      data
    );
    return res.data;
  },

  getMe: async () => {
    const res = await axiosClient.get<GetMeResponse>('/registrar/auth/me');
    return {
      userId: res.data.data.id,
      role: res.data.data.role,
    } satisfies SessionUser;
  },

  logout: async () => {
    await axiosClient.post('/registrar/auth/logout');
  },

  getUserKycs: async (status: RegistrarKycStatus) => {
    const res = await axiosClient.get<RegistrarGetUserKycResponse>(
      '/registrar/kyc/users',
      {
        params: { status },
      }
    );
    return res.data;
  },
};
