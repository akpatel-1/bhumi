import { registrarApi } from '@/services/registrar/registrar.api';
import type {
  AuthRole,
  LoginPayload,
  LoginResponse,
  SessionUser,
} from '@/types/admin/auth.types';

import axios from 'axios';
import { create } from 'zustand';

type CacheEntry = {
  response: LoginResponse;
  email: string;
  expiresAt: number;
};

type RegistrarAuthState = {
  isLoading: boolean;
  error: string | null;
  user: SessionUser | null;
  cache: Partial<Record<AuthRole, CacheEntry>>;
};

type RegistrarAuthActions = {
  clearError: () => void;
  clearStore: () => void;
  clearRoleCache: (role: AuthRole) => void;
  getMe: () => Promise<SessionUser | null>;
  getOrFetchLoginResponse: (
    role: AuthRole,
    payload: LoginPayload,
    options?: LoginOptions
  ) => Promise<LoginResponse>;
};

type RegistrarAuthStore = RegistrarAuthState & RegistrarAuthActions;

type LoginOptions = {
  useCache?: boolean;
  ttlMs?: number;
};

const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000;

const getCachedResponse = (
  cache: Partial<Record<AuthRole, CacheEntry>>,
  role: AuthRole,
  email: string
) => {
  const cacheEntry = cache[role];

  if (!cacheEntry) return null;
  if (cacheEntry.expiresAt <= Date.now()) return null;
  if (cacheEntry.email !== email.trim().toLowerCase()) return null;

  return cacheEntry.response;
};

export const useRegistrarAuthStore = create<RegistrarAuthStore>((set, get) => ({
  isLoading: false,
  error: null,
  user: null,
  cache: {},

  clearError: () => set({ error: null }),

  clearStore: () =>
    set({
      isLoading: false,
      error: null,
      user: null,
      cache: {},
    }),

  clearRoleCache: (role: AuthRole) => {
    const nextCache = { ...get().cache };
    delete nextCache[role];
    set({ cache: nextCache });
  },

  getMe: async () => {
    const existingUser = get().user;

    if (existingUser) {
      return existingUser;
    }

    try {
      const user = await registrarApi.getMe();
      set({ user, error: null });
      return user;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        get().clearStore();
        return null;
      }

      throw error;
    }
  },

  getOrFetchLoginResponse: async (
    role: AuthRole,
    payload: LoginPayload,
    options: LoginOptions = {}
  ) => {
    const useCache = options.useCache ?? true;
    const ttlMs = options.ttlMs ?? DEFAULT_CACHE_TTL_MS;
    const normalizedEmail = payload.email.trim().toLowerCase();

    if (useCache) {
      const cached = getCachedResponse(get().cache, role, normalizedEmail);
      if (cached) return cached;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await registrarApi.login({
        ...payload,
        email: normalizedEmail,
      });

      if (response?.data?.role !== role) {
        throw new Error(
          `This account belongs to ${response?.data?.role ?? 'another role'}.`
        );
      }

      set((state) => ({
        isLoading: false,
        error: null,
        user: {
          userId: response.data.id,
          role: response.data.role,
        },
        cache: {
          ...state.cache,
          [role]: {
            response,
            email: normalizedEmail,
            expiresAt: Date.now() + ttlMs,
          },
        },
      }));

      return response;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to sign in right now.';

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },
}));

export const registrarAuthStore = {
  subscribe: useRegistrarAuthStore.subscribe,
  getSnapshot: useRegistrarAuthStore.getState,
  clearError: () => useRegistrarAuthStore.getState().clearError(),
  clearStore: () => useRegistrarAuthStore.getState().clearStore(),
  clearRoleCache: (role: AuthRole) =>
    useRegistrarAuthStore.getState().clearRoleCache(role),
  getMe: () => useRegistrarAuthStore.getState().getMe(),
  getOrFetchLoginResponse: (
    role: AuthRole,
    payload: LoginPayload,
    options?: LoginOptions
  ) =>
    useRegistrarAuthStore
      .getState()
      .getOrFetchLoginResponse(role, payload, options),
};
