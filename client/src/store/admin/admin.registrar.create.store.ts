import { adminApi } from '@/services/admin/admin.api';
import type {
  CreateRegistrarPayload,
  CreateRegistrarResponse,
  RegistrarSummary,
} from '@/types/admin/admin.registrar.create.types';

import axios from 'axios';
import { create } from 'zustand';

type AdminRegistrarCreateState = {
  isLoading: boolean;
  error: string | null;
  response: CreateRegistrarResponse | null;
  registrar: RegistrarSummary | null;
  responses: CreateRegistrarResponse[];
};

type AdminRegistrarCreateActions = {
  clearError: () => void;
  clearResult: () => void;
  clearStore: () => void;
  createRegistrar: (
    payload: CreateRegistrarPayload
  ) => Promise<CreateRegistrarResponse>;
};

type AdminRegistrarCreateStore = AdminRegistrarCreateState &
  AdminRegistrarCreateActions;

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)
      ?.message;
    return message || error.message || 'Request failed.';
  }

  return error instanceof Error ? error.message : 'Request failed.';
};

const snapshotResponse = (response: CreateRegistrarResponse) => {
  try {
    return typeof structuredClone === 'function'
      ? structuredClone(response)
      : (JSON.parse(JSON.stringify(response)) as CreateRegistrarResponse);
  } catch {
    return response;
  }
};

export const useAdminRegistrarCreateStore = create<AdminRegistrarCreateStore>(
  (set) => ({
    isLoading: false,
    error: null,
    response: null,
    registrar: null,
    responses: [],

    clearError: () => set({ error: null }),

    clearResult: () =>
      set({
        isLoading: false,
        error: null,
        response: null,
        registrar: null,
      }),

    clearStore: () =>
      set({
        isLoading: false,
        error: null,
        response: null,
        registrar: null,
        responses: [],
      }),

    createRegistrar: async (payload) => {
      const normalized: CreateRegistrarPayload = {
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
        district: payload.district.trim(),
        state: payload.state.trim(),
      };

      set({ isLoading: true, error: null });

      try {
        const response = await adminApi.createRegistrar(normalized);

        set((state) => ({
          isLoading: false,
          error: null,
          response,
          registrar: response.data,
          responses: [snapshotResponse(response), ...state.responses],
        }));

        return response;
      } catch (error) {
        const message = getErrorMessage(error);
        set({ isLoading: false, error: message });
        throw error;
      }
    },
  })
);

export const adminRegistrarCreateStore = {
  subscribe: useAdminRegistrarCreateStore.subscribe,
  getSnapshot: useAdminRegistrarCreateStore.getState,
  clearError: () => useAdminRegistrarCreateStore.getState().clearError(),
  clearResult: () => useAdminRegistrarCreateStore.getState().clearResult(),
  clearStore: () => useAdminRegistrarCreateStore.getState().clearStore(),
  createRegistrar: (payload: CreateRegistrarPayload) =>
    useAdminRegistrarCreateStore.getState().createRegistrar(payload),
};
