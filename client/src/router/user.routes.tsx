import { Navigate, redirect } from 'react-router-dom';

import { userAuthLoader } from '@/loader/user.auth.loader';
import UserAuthPage from '@/pages/user/UserAuthPage';
import UserDashboard from '@/pages/user/UserDashboard';
import UserKycStatusPage from '@/pages/user/UserKycStatusPage';
import UserLandDetailsPage from '@/pages/user/UserLandDetailsPage';
import UserLandRegistrationPage from '@/pages/user/UserLandRegistrationPage';
import UserLandSearchPage from '@/pages/user/UserLandSearchPage';
import UserProfilePage from '@/pages/user/UserProfilePage';

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
        element: <UserKycStatusPage />,
      },
      {
        path: 'profile',
        element: <UserProfilePage />,
      },
      {
        path: 'land',
        element: <UserLandDetailsPage />,
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
