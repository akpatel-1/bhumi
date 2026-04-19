import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import LoginPage from '@/components/auth/LoginPage';
import {
  registrarAuthStore,
  useRegistrarAuthStore,
} from '@/store/registrar/registrar.auth.store';

export default function RegistrarLoginPage() {
  const navigate = useNavigate();
  const user = useRegistrarAuthStore((state) => state.user);

  useEffect(() => {
    void registrarAuthStore.getMe();
  }, []);

  useEffect(() => {
    if (user?.role === 'registrar') {
      navigate('/registrar/overview', { replace: true });
    }
  }, [navigate, user]);

  return (
    <LoginPage
      role="registrar"
      user={user}
      onSubmit={async (payload) => {
        await registrarAuthStore.getOrFetchLoginResponse('registrar', payload);
        navigate('/registrar/overview', { replace: true });
      }}
    />
  );
}
