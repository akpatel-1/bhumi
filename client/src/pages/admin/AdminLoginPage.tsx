import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import LoginPage from '@/components/auth/LoginPage';
import {
  adminAuthStore,
  useAdminAuthStore,
} from '@/store/admin/admin.auth.store';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const user = useAdminAuthStore((state) => state.user);

  useEffect(() => {
    void adminAuthStore.getMe();
  }, []);

  return (
    <LoginPage
      role="admin"
      user={user}
      onSubmit={async (payload) => {
        await adminAuthStore.getOrFetchLoginResponse('admin', payload);
        navigate('/admin/overview', { replace: true });
      }}
    />
  );
}
