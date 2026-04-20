import { registrarApi } from '@/services/registrar/registrar.api';
import type {
  RegistrarKycStatus,
  RegistrarUserKycItem,
} from '@/types/registrar/registrar.kyc.types';

import axios from 'axios';
import { create } from 'zustand';

type StatusCache = {
  hasFetched: boolean;
  isLoading: boolean;
  error: string | null;
  data: RegistrarUserKycItem[];
};

type RegistrarKycState = {
  byStatus: Record<RegistrarKycStatus, StatusCache>;
};

type RegistrarKycActions = {
  clear: () => void;
  clearStatus: (status: RegistrarKycStatus) => void;
  fetchUsers: (
    status: RegistrarKycStatus,
    options?: {
      force?: boolean;
    }
  ) => Promise<RegistrarUserKycItem[]>;
  approve: (userId: string) => Promise<void>;
  reject: (userId: string, reason: string) => Promise<void>;
};

type RegistrarKycStore = RegistrarKycState & RegistrarKycActions;

const emptyStatusCache = (): StatusCache => ({
  hasFetched: false,
  isLoading: false,
  error: null,
  data: [],
});

const emptyState = (): RegistrarKycState => ({
  byStatus: {
    pending: emptyStatusCache(),
    approved: emptyStatusCache(),
    rejected: emptyStatusCache(),
  },
});

export const useRegistrarKycStore = create<RegistrarKycStore>((set, get) => ({
  ...emptyState(),

  clear: () => set(emptyState()),

  clearStatus: (status) =>
    set((state) => ({
      byStatus: {
        ...state.byStatus,
        [status]: emptyStatusCache(),
      },
    })),

  fetchUsers: async (status, options = {}) => {
    const force = options.force ?? false;
    const cache = get().byStatus[status];

    if (!force && (cache.isLoading || cache.hasFetched)) {
      return cache.data;
    }

    set((state) => ({
      byStatus: {
        ...state.byStatus,
        [status]: {
          ...state.byStatus[status],
          isLoading: true,
          error: null,
        },
      },
    }));

    try {
      const response = await registrarApi.getUserKycs(status);

      set((state) => ({
        byStatus: {
          ...state.byStatus,
          [status]: {
            hasFetched: true,
            isLoading: false,
            error: null,
            data: response.data ?? [],
          },
        },
      }));

      return response.data ?? [];
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? 'Unable to fetch user KYC list.')
        : error instanceof Error
          ? error.message
          : 'Unable to fetch user KYC list.';

      set((state) => ({
        byStatus: {
          ...state.byStatus,
          [status]: {
            ...state.byStatus[status],
            hasFetched: true,
            isLoading: false,
            error: message,
          },
        },
      }));

      return get().byStatus[status].data;
    }
  },

  approve: async (userId) => {
    try {
      await registrarApi.approveUserKyc(userId);

      set((state) => {
        const nextPending = state.byStatus.pending.data.filter(
          (item) => item.user_id !== userId
        );

        return {
          byStatus: {
            ...state.byStatus,
            pending: {
              ...state.byStatus.pending,
              data: nextPending,
            },
            approved: {
              ...state.byStatus.approved,
              hasFetched: false,
            },
          },
        };
      });
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? 'Unable to approve KYC.')
        : error instanceof Error
          ? error.message
          : 'Unable to approve KYC.';

      set((state) => ({
        byStatus: {
          ...state.byStatus,
          pending: {
            ...state.byStatus.pending,
            error: message,
          },
        },
      }));

      throw error;
    }
  },

  reject: async (userId, reason) => {
    const trimmed = reason.trim();
    if (!trimmed) {
      const error = new Error('Rejection reason is required.');
      set((state) => ({
        byStatus: {
          ...state.byStatus,
          pending: {
            ...state.byStatus.pending,
            error: error.message,
          },
        },
      }));
      throw error;
    }

    try {
      await registrarApi.rejectUserKyc(userId, trimmed);

      set((state) => {
        const nextPending = state.byStatus.pending.data.filter(
          (item) => item.user_id !== userId
        );

        return {
          byStatus: {
            ...state.byStatus,
            pending: {
              ...state.byStatus.pending,
              data: nextPending,
            },
            rejected: {
              ...state.byStatus.rejected,
              hasFetched: false,
            },
          },
        };
      });
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? 'Unable to reject KYC.')
        : error instanceof Error
          ? error.message
          : 'Unable to reject KYC.';

      set((state) => ({
        byStatus: {
          ...state.byStatus,
          pending: {
            ...state.byStatus.pending,
            error: message,
          },
        },
      }));

      throw error;
    }
  },
}));

export const registrarKycStore = {
  subscribe: useRegistrarKycStore.subscribe,
  getSnapshot: useRegistrarKycStore.getState,
  clear: () => useRegistrarKycStore.getState().clear(),
  clearStatus: (status: RegistrarKycStatus) =>
    useRegistrarKycStore.getState().clearStatus(status),
  fetchUsers: (status: RegistrarKycStatus, options?: { force?: boolean }) =>
    useRegistrarKycStore.getState().fetchUsers(status, options),
  approve: (userId: string) => useRegistrarKycStore.getState().approve(userId),
  reject: (userId: string, reason: string) =>
    useRegistrarKycStore.getState().reject(userId, reason),
};
