import { redirect } from 'react-router-dom';

import { registrarAuthLoader } from '@/loader/registrar.auth.loader';
import RegistrarLoginPage from '@/pages/registrar/RegistrarLoginPage';
import RegistrarOverviewPage from '@/pages/registrar/RegistrarOverviewPage';

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
    path: '/registrar/overview',
    loader: requireRegistrarAuthLoader,
    element: <RegistrarOverviewPage />,
  },
];
