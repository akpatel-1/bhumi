import { userApi } from '@/services/user/user.api';
import { useUserKycStore } from '@/store/user/user.kyc.store';
import type {
  UserEmailPayload,
  UserSessionUser,
  UserVerifyOtpPayload,
} from '@/types/user/auth.types';

import axios from 'axios';
import { create } from 'zustand';

type UserAuthState = {
  user: UserSessionUser | null;
};

type UserAuthActions = {
  clearUser: () => void;
  logout: () => Promise<void>;
  requestOtp: (payload: UserEmailPayload) => Promise<void>;
  resendOtp: (payload: UserEmailPayload) => Promise<void>;
  verifyOtp: (payload: UserVerifyOtpPayload) => Promise<UserSessionUser>;
  checkSessionCache: () => Promise<boolean>;
};

type UserAuthStore = UserAuthState & UserAuthActions;

export const userAuthStore = create<UserAuthStore>((set, get) => ({
  user: null,

  clearUser: () => set({ user: null }),

  logout: async () => {
    try {
      await userApi.logout();
    } catch {
      // ignore logout errors; we'll still clear client state
    } finally {
      get().clearUser();
      useUserKycStore.getState().clear();
    }
  },

  requestOtp: async (payload) => {
    await userApi.requestOtp({ email: payload.email.trim().toLowerCase() });
  },

  resendOtp: async (payload) => {
    await userApi.requestOtp({ email: payload.email.trim().toLowerCase() });
  },

  verifyOtp: async (payload) => {
    const normalized = {
      email: payload.email.trim().toLowerCase(),
      otp: payload.otp.trim(),
    };

    const response = await userApi.verifyOtp(normalized);

    const user: UserSessionUser = {
      userId: response.data.id,
      role: response.data.role,
    };

    set({ user });
    return user;
  },

  checkSessionCache: async () => {
    const existing = get().user;
    if (existing) return true;

    try {
      const user = await userApi.getMe();
      set({ user });
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        set({ user: null });
        return false;
      }

      return false;
    }
  },
}));
