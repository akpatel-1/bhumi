import { userApi } from '@/services/user/user.api';
import type {
  UserLandSearchFilter,
  UserLandSearchItem,
} from '@/types/user/user.land.types';

import axios from 'axios';
import { create } from 'zustand';

type LandSearchState = {
  isLoading: boolean;
  error: string | null;
  filters: UserLandSearchFilter;
  results: UserLandSearchItem[];
  cache: Record<string, UserLandSearchItem[]>;
};

type LandSearchActions = {
  setFilters: (filters: UserLandSearchFilter) => void;
  clear: () => void;
  searchByFilters: (
    filters: UserLandSearchFilter,
    options?: { force?: boolean }
  ) => Promise<UserLandSearchItem[]>;
};

type LandSearchStore = LandSearchState & LandSearchActions;

const defaultFilters: UserLandSearchFilter = {
  district: '',
  tehsil: '',
  village: '',
};

const makeCacheKey = ({ district, tehsil, village }: UserLandSearchFilter) =>
  `${district.trim().toLowerCase()}|${tehsil.trim().toLowerCase()}|${village
    .trim()
    .toLowerCase()}`;

export const useLandSearchStore = create<LandSearchStore>((set, get) => ({
  isLoading: false,
  error: null,
  filters: defaultFilters,
  results: [],
  cache: {},

  setFilters: (filters) => set({ filters }),

  clear: () =>
    set({
      isLoading: false,
      error: null,
      filters: defaultFilters,
      results: [],
      cache: {},
    }),

  searchByFilters: async (filters, options = {}) => {
    const force = options.force ?? false;
    const key = makeCacheKey(filters);
    const cached = get().cache[key];

    set({ filters, error: null });

    if (!force && cached) {
      set({ isLoading: false, results: cached });
      return cached;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await userApi.searchLand(filters);
      const data = response.data ?? [];

      set((state) => ({
        isLoading: false,
        error: null,
        results: data,
        cache: {
          ...state.cache,
          [key]: data,
        },
      }));

      return data;
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? 'Unable to search land records.')
        : error instanceof Error
          ? error.message
          : 'Unable to search land records.';

      set({
        isLoading: false,
        error: message,
        results: [],
      });

      return [];
    }
  },
}));
