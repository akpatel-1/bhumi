import { adminApi } from '@/services/admin/admin.api';
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

type AdminAuthState = {
  isLoading: boolean;
  error: string | null;
  user: SessionUser | null;
  cache: Partial<Record<AuthRole, CacheEntry>>;
};

type AdminAuthActions = {
  clearError: () => void;
  clearStore: () => void;
  clearRoleCache: (role: AuthRole) => void;
  getMe: () => Promise<SessionUser | null>;
  logout: () => Promise<void>;
  getOrFetchLoginResponse: (
    role: AuthRole,
    payload: LoginPayload,
    options?: LoginOptions
  ) => Promise<LoginResponse>;
};

type AdminAuthStore = AdminAuthState & AdminAuthActions;

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

export const useAdminAuthStore = create<AdminAuthStore>((set, get) => ({
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
      const user = await adminApi.getMe();
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

  logout: async () => {
    try {
      await adminApi.logout();
    } catch {
      // ignore logout errors; we'll still clear client state
    } finally {
      get().clearStore();
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
      const response = await adminApi.login({
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

export const adminAuthStore = {
  subscribe: useAdminAuthStore.subscribe,
  getSnapshot: useAdminAuthStore.getState,
  clearError: () => useAdminAuthStore.getState().clearError(),
  clearStore: () => useAdminAuthStore.getState().clearStore(),
  clearRoleCache: (role: AuthRole) =>
    useAdminAuthStore.getState().clearRoleCache(role),
  getMe: () => useAdminAuthStore.getState().getMe(),
  logout: () => useAdminAuthStore.getState().logout(),
  getOrFetchLoginResponse: (
    role: AuthRole,
    payload: LoginPayload,
    options?: LoginOptions
  ) =>
    useAdminAuthStore
      .getState()
      .getOrFetchLoginResponse(role, payload, options),
};
