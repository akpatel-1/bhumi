import { createBrowserRouter } from 'react-router-dom';

import RootLayout from './RootLayout';
import { adminRoutes } from './admin.routes';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [...adminRoutes],
  },
]);
