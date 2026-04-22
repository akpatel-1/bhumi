import { userApi } from '@/services/user/user.api';
import type { UserLandHistoryPageItem } from '@/types/user/user.land.types';

import axios from 'axios';
import { create } from 'zustand';

type UserLandHistoryPageState = {
  currentLandId: string | null;
  hasFetched: boolean;
  isLoading: boolean;
  error: string | null;
  records: UserLandHistoryPageItem[];
};

type UserLandHistoryPageActions = {
  reset: () => void;
  fetchLandHistory: (
    landId: string,
    options?: {
      force?: boolean;
    }
  ) => Promise<UserLandHistoryPageItem[]>;
};

type UserLandHistoryPageStore = UserLandHistoryPageState &
  UserLandHistoryPageActions;

const initialState: UserLandHistoryPageState = {
  currentLandId: null,
  hasFetched: false,
  isLoading: false,
  error: null,
  records: [],
};

export const useUserLandHistoryPageStore = create<UserLandHistoryPageStore>(
  (set, get) => ({
    ...initialState,

    reset: () => set(initialState),

    fetchLandHistory: async (landId, options = {}) => {
      const force = options.force ?? false;
      const state = get();

      if (
        !force &&
        state.currentLandId === landId &&
        (state.hasFetched || state.isLoading)
      ) {
        return state.records;
      }

      set({
        currentLandId: landId,
        isLoading: true,
        hasFetched: false,
        error: null,
        records: [],
      });

      try {
        const response = await userApi.getLandHistory(landId);
        const data = response.data ?? [];

        set({
          currentLandId: landId,
          hasFetched: true,
          isLoading: false,
          error: null,
          records: data,
        });

        return data;
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? (error.response?.data?.message ?? 'Unable to fetch land history.')
          : error instanceof Error
            ? error.message
            : 'Unable to fetch land history.';

        set({
          currentLandId: landId,
          hasFetched: true,
          isLoading: false,
          error: message,
          records: [],
        });

        return [];
      }
    },
  })
);
