import { Navigate, redirect } from 'react-router-dom';

import { userAuthLoader } from '@/loader/user.auth.loader';
import UserAuthPage from '@/pages/user/UserAuthPage';
import UserDashboard from '@/pages/user/UserDashboard';
import UserKycPage from '@/pages/user/UserKycPage';
import UserLandRegistrationPage from '@/pages/user/UserLandRegistrationPage';
import UserLandSearchPage from '@/pages/user/UserLandSearchPage';

const requireUserAuthLoader = async () => {
  const user = await userAuthLoader();

  if (!user) {
    throw redirect('/user/auth');
  }

  return user;
};

export const userRoutes = [
  {
    path: '/',
    element: <UserAuthPage />,
  },
  {
    path: '/user/auth',
    element: <UserAuthPage />,
  },
  {
    path: '/user',
    loader: requireUserAuthLoader,
    element: <UserDashboard />,
    children: [
      {
        index: true,
        element: <Navigate to="/user/kyc" replace />,
      },
      {
        path: 'overview',
        element: <Navigate to="/user/kyc" replace />,
      },
      {
        path: 'kyc',
        element: <UserKycPage />,
      },
      {
        path: 'land-registration',
        element: <UserLandRegistrationPage />,
      },
      {
        path: 'search-land',
        element: <UserLandSearchPage />,
      },
    ],
  },
];
