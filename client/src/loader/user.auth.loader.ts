import { userAuthStore } from '@/store/user/user.auth.store';

export const userAuthLoader = async () => {
  const store = userAuthStore.getState();

  if (store.user) {
    return store.user;
  }

  const isVerified = await store.checkSessionCache();
  if (!isVerified) return null;

  return userAuthStore.getState().user;
};
