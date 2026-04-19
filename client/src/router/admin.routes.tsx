import { redirect } from 'react-router-dom';

import { adminAuthLoader } from '@/loader/admin.auth.loader';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminOverviewPage from '@/pages/admin/AdminOverviewPage';

const requireAdminAuthLoader = async () => {
  const user = await adminAuthLoader();

  if (!user) {
    throw redirect('/admin/login');
  }

  return user;
};

export const adminRoutes = [
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin/overview',
    loader: requireAdminAuthLoader,
    element: <AdminOverviewPage />,
  },
];
