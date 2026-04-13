import { useNavigate } from 'react-router-dom';

import LoginPage from '@/components/auth/LoginPage';
import { adminAuthStore } from '@/store/admin/admin.auth.store';

export default function AdminLoginPage() {
  const navigate = useNavigate();

  return (
    <LoginPage
      role="admin"
      onSubmit={async (payload) => {
        await adminAuthStore.getOrFetchLoginResponse('admin', payload);
        navigate('/admin/overview', { replace: true });
      }}
    />
  );
}
