import type {
  UserEmailPayload,
  UserGetMeResponse,
  UserRequestOtpResponse,
  UserSessionUser,
  UserVerifyOtpPayload,
  UserVerifyOtpResponse,
} from '@/types/user/auth.types';

import { userClient } from './user.client';

export const userApi = {
  requestOtp: async (data: UserEmailPayload) => {
    const res = await userClient.post<UserRequestOtpResponse>(
      '/user/auth/request-otp',
      data
    );
    return res.data;
  },

  verifyOtp: async (data: UserVerifyOtpPayload) => {
    const res = await userClient.post<UserVerifyOtpResponse>(
      '/user/auth/verify-otp',
      data
    );
    return res.data;
  },

  getMe: async (): Promise<UserSessionUser> => {
    const res = await userClient.get<UserGetMeResponse>('/user/auth/me');

    return {
      userId: res.data.data.id,
      role: res.data.data.role,
    };
  },

  logout: async () => {
    await userClient.post('/user/auth/logout');
  },
};
