import { userApi } from '@/services/user/user.api';
import type { UserLandDetailsItem } from '@/types/user/user.land.types';

import axios from 'axios';
import { create } from 'zustand';

type UserLandState = {
  hasFetched: boolean;
  isLoading: boolean;
  error: string | null;
  landDetails: UserLandDetailsItem[];
};

type UserLandActions = {
  clear: () => void;
  fetchLandDetails: (options?: {
    force?: boolean;
  }) => Promise<UserLandDetailsItem[]>;
};

type UserLandStore = UserLandState & UserLandActions;

export const useUserLandDetailsStore = create<UserLandStore>((set, get) => ({
  hasFetched: false,
  isLoading: false,
  error: null,
  landDetails: [],

  clear: () =>
    set({
      hasFetched: false,
      isLoading: false,
      error: null,
      landDetails: [],
    }),

  fetchLandDetails: async (options = {}) => {
    const force = options.force ?? false;

    if (!force && (get().hasFetched || get().isLoading)) {
      return get().landDetails;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await userApi.getLandDetails();
      const data = response.data ?? [];

      set({
        hasFetched: true,
        isLoading: false,
        error: null,
        landDetails: data,
      });

      return data;
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? 'Unable to fetch land details.')
        : error instanceof Error
          ? error.message
          : 'Unable to fetch land details.';

      set({
        hasFetched: true,
        isLoading: false,
        error: message,
        landDetails: [],
      });

      return [];
    }
  },
}));
