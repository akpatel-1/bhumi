import type {
  UserEmailPayload,
  UserGetMeResponse,
  UserRequestOtpResponse,
  UserSessionUser,
  UserVerifyOtpPayload,
  UserVerifyOtpResponse,
} from '@/types/user/auth.types';
import type {
  UserKycStatusResponse,
  UserSubmitKycPayload,
  UserSubmitKycResponse,
} from '@/types/user/user.kyc.types';
import type {
  UserLandDetailsResponse,
  UserLandSearchFilter,
  UserLandSearchResponse,
} from '@/types/user/user.land.types';
import type { UserProfileResponse } from '@/types/user/user.profile.types';

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

  kycStatus: async () => {
    const res = await userClient.get<UserKycStatusResponse>('/user/kyc/status');
    return res.data;
  },

  submitKyc: async (payload: UserSubmitKycPayload) => {
    const formData = new FormData();
    formData.append('pan_name', payload.pan_name);
    formData.append('phone', payload.phone);
    formData.append('address', payload.address);
    formData.append('pincode', payload.pincode);
    formData.append('district', payload.district);
    formData.append('state', payload.state);
    formData.append('pan_number', payload.pan_number);
    formData.append('pan_document', payload.pan_document);

    const res = await userClient.post<UserSubmitKycResponse>(
      '/user/kyc',
      formData
    );
    return res.data;
  },

  getLandDetails: async () => {
    const res = await userClient.get<UserLandDetailsResponse>('/user/land');
    return res.data;
  },

  searchLand: async (filters: UserLandSearchFilter) => {
    const res = await userClient.get<UserLandSearchResponse>(
      '/user/land/search',
      {
        params: filters,
      }
    );
    return res.data;
  },

  getProfile: async () => {
    const res = await userClient.get<UserProfileResponse>('/user/profile');
    return res.data;
  },

  logout: async () => {
    await userClient.post('/user/auth/logout');
  },
};
