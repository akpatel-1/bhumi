import { adminApi } from '@/services/admin/admin.api';
import type { AdminRegistrarListItem } from '@/types/admin/auth.types';

import axios from 'axios';
import { create } from 'zustand';

type AdminRegistrarListState = {
  isLoading: boolean;
  error: string | null;
  registrars: AdminRegistrarListItem[];
  lastFetchedAt: number | null;
};

type AdminRegistrarListActions = {
  clearError: () => void;
  clearStore: () => void;
  fetchRegistrars: (options?: {
    force?: boolean;
    maxAgeMs?: number;
  }) => Promise<AdminRegistrarListItem[]>;
};

type AdminRegistrarListStore = AdminRegistrarListState &
  AdminRegistrarListActions;

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)
      ?.message;
    return message || error.message || 'Request failed.';
  }

  return error instanceof Error ? error.message : 'Request failed.';
};

export const useAdminRegistrarListStore = create<AdminRegistrarListStore>(
  (set, get) => ({
    isLoading: false,
    error: null,
    registrars: [],
    lastFetchedAt: null,

    clearError: () => set({ error: null }),

    clearStore: () =>
      set({
        isLoading: false,
        error: null,
        registrars: [],
        lastFetchedAt: null,
      }),

    fetchRegistrars: async (options = {}) => {
      const force = options.force ?? false;
      const maxAgeMs = options.maxAgeMs ?? 5 * 60 * 1000;

      const { registrars, lastFetchedAt } = get();
      const isFresh =
        typeof lastFetchedAt === 'number' &&
        Date.now() - lastFetchedAt < maxAgeMs;

      if (!force && registrars.length > 0 && isFresh) {
        return registrars;
      }

      set({ isLoading: true, error: null });

      try {
        const response = await adminApi.getAllRegistrar();
        const registrars = response?.data ?? [];
        set({
          isLoading: false,
          error: null,
          registrars,
          lastFetchedAt: Date.now(),
        });
        return registrars;
      } catch (error) {
        const message = getErrorMessage(error);
        set({ isLoading: false, error: message });
        throw error;
      }
    },
  })
);

export const adminRegistrarListStore = {
  subscribe: useAdminRegistrarListStore.subscribe,
  getSnapshot: useAdminRegistrarListStore.getState,
  clearError: () => useAdminRegistrarListStore.getState().clearError(),
  clearStore: () => useAdminRegistrarListStore.getState().clearStore(),
  fetchRegistrars: (options?: { force?: boolean; maxAgeMs?: number }) =>
    useAdminRegistrarListStore.getState().fetchRegistrars(options),
};
