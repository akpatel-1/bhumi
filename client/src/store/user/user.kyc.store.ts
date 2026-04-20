import { userApi } from '@/services/user/user.api';
import type {
  UserKycStatusData,
  UserKycStatusResponse,
} from '@/types/user/user.kyc.types';

import axios from 'axios';
import { create } from 'zustand';

type UserKycState = {
  hasFetched: boolean;
  isLoading: boolean;
  error: string | null;
  kyc: UserKycStatusData | null;
};

type UserKycActions = {
  clear: () => void;
  clearForReapply: () => void;
  fetchStatus: (options?: {
    force?: boolean;
  }) => Promise<UserKycStatusData | null>;
};

type UserKycStore = UserKycState & UserKycActions;

function normalizeKycStatusData(
  data: UserKycStatusResponse['data'] | null
): UserKycStatusData | null {
  if (!data) return null;

  const anyData = data as unknown as Record<string, unknown>;
  const rejectionReason =
    (anyData.rejection_reason as string | null | undefined) ??
    (anyData.rejected_reason as string | null | undefined) ??
    null;

  return {
    user_id: String(anyData.user_id ?? ''),
    status: anyData.status as UserKycStatusData['status'],
    rejection_reason: rejectionReason,
    submitted_at: String(anyData.submitted_at ?? ''),
  };
}

export const useUserKycStore = create<UserKycStore>((set, get) => ({
  hasFetched: false,
  isLoading: false,
  error: null,
  kyc: null,

  clear: () =>
    set({
      hasFetched: false,
      isLoading: false,
      error: null,
      kyc: null,
    }),

  clearForReapply: () =>
    set({
      hasFetched: true,
      error: null,
      kyc: null,
    }),

  fetchStatus: async (options = {}) => {
    const force = options.force ?? false;

    if (!force && (get().hasFetched || get().isLoading)) {
      return get().kyc;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await userApi.kycStatus();
      const normalized = normalizeKycStatusData(response.data);

      set({
        hasFetched: true,
        isLoading: false,
        error: null,
        kyc: normalized,
      });

      return normalized;
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? 'Unable to fetch KYC status.')
        : error instanceof Error
          ? error.message
          : 'Unable to fetch KYC status.';

      set({ hasFetched: true, isLoading: false, error: message });
      return null;
    }
  },
}));
