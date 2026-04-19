import { registrarAuthStore } from '@/store/registrar/registrar.auth.store';

export const registrarAuthLoader = async () => {
  return registrarAuthStore.getMe();
};
