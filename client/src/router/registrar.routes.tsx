import { Navigate, redirect } from 'react-router-dom';

import { registrarAuthLoader } from '@/loader/registrar.auth.loader';
import RegistrarDashboard from '@/pages/registrar/RegistrarDashboard';
import RegistrarLandKycPage from '@/pages/registrar/RegistrarLandVerificationPage';
import RegistrarLoginPage from '@/pages/registrar/RegistrarLoginPage';
import RegistrarUserKycPage from '@/pages/registrar/RegistrarUserKycPage';

const requireRegistrarAuthLoader = async () => {
  const user = await registrarAuthLoader();

  if (!user) {
    throw redirect('/registrar/login');
  }

  return user;
};

export const registrarRoutes = [
  {
    path: '/registrar/login',
    element: <RegistrarLoginPage />,
  },
  {
    path: '/registrar',
    loader: requireRegistrarAuthLoader,
    element: <RegistrarDashboard />,
    children: [
      {
        index: true,
        element: <Navigate to="/registrar/user-kyc" replace />,
      },
      {
        path: 'overview',
        element: <Navigate to="/registrar/user-kyc" replace />,
      },
      {
        path: 'user-kyc',
        element: <RegistrarUserKycPage />,
      },
      {
        path: 'land-kyc',
        element: <RegistrarLandKycPage />,
      },
    ],
  },
];
