import { redirect } from 'react-router-dom';

import { userAuthLoader } from '@/loader/user.auth.loader';
import UserAuthPage from '@/pages/user/UserAuthPage';
import UserOverviewPage from '@/pages/user/UserOverviewPage';

const requireUserAuthLoader = async () => {
  const user = await userAuthLoader();

  if (!user) {
    throw redirect('/user/auth');
  }

  return user;
};

export const userRoutes = [
  {
    path: '/auth',
    element: <UserAuthPage />,
  },
  {
    path: '/user/overview',
    loader: requireUserAuthLoader,
    element: <UserOverviewPage />,
  },
];
