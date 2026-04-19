import { adminAuthStore } from '@/store/admin/admin.auth.store';

export const adminAuthLoader = async () => {
  return adminAuthStore.getMe();
};
