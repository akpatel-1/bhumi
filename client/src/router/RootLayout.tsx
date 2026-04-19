import { Outlet, useNavigation } from 'react-router-dom';

import { LoadingSpinner } from '@/router/LoadingSpinner';

export default function RootLayout() {
  const navigation = useNavigation();
  const isBusy = navigation.state !== 'idle';

  return (
    <>
      {isBusy ? <LoadingSpinner fullScreen label="Loading..." /> : null}
      <Outlet />
    </>
  );
}
