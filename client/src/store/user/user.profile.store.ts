import { userApi } from '@/services/user/user.api';
import type { UserProfileInfo } from '@/types/user/user.profile.types';

import axios from 'axios';
import { create } from 'zustand';

type UserProfileState = {
  hasFetched: boolean;
  isLoading: boolean;
  error: string | null;
  errorCode: string | null;
  profile: UserProfileInfo | null;
};

type UserProfileActions = {
  clear: () => void;
  fetchProfile: (options?: {
    force?: boolean;
  }) => Promise<UserProfileInfo | null>;
};

type UserProfileStore = UserProfileState & UserProfileActions;

export const useUserProfileStore = create<UserProfileStore>((set, get) => ({
  hasFetched: false,
  isLoading: false,
  error: null,
  errorCode: null,
  profile: null,

  clear: () =>
    set({
      hasFetched: false,
      isLoading: false,
      error: null,
      errorCode: null,
      profile: null,
    }),

  fetchProfile: async (options = {}) => {
    const force = options.force ?? false;

    if (!force && (get().hasFetched || get().isLoading)) {
      return get().profile;
    }

    set({ isLoading: true, error: null, errorCode: null });

    try {
      const response = await userApi.getProfile();
      const data = response.data;

      set({
        hasFetched: true,
        isLoading: false,
        error: null,
        errorCode: null,
        profile: data,
      });

      return data;
    } catch (error) {
      const code =
        axios.isAxiosError(error) &&
        typeof error.response?.data?.code === 'string'
          ? error.response.data.code
          : null;

      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? 'Unable to fetch profile info.')
        : error instanceof Error
          ? error.message
          : 'Unable to fetch profile info.';

      set({
        hasFetched: true,
        isLoading: false,
        error: message,
        errorCode: code,
        profile: null,
      });

      return null;
    }
  },
}));
