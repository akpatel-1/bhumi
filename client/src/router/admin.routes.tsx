import { Navigate, redirect } from 'react-router-dom';

import { adminAuthLoader } from '@/loader/admin.auth.loader';
import AdminCreateRegistrarPage from '@/pages/admin/AdminCreateRegistrarPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
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
    path: '/admin',
    loader: requireAdminAuthLoader,
    element: <AdminDashboard />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/overview" replace />,
      },
      {
        path: 'overview',
        element: <AdminOverviewPage />,
      },
      {
        path: 'registrars/create',
        element: <AdminCreateRegistrarPage />,
      },
    ],
  },
];
