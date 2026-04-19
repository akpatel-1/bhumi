import { createBrowserRouter } from 'react-router-dom';

import RootLayout from './RootLayout';
import { adminRoutes } from './admin.routes';
import { registrarRoutes } from './registrar.routes';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [...adminRoutes, ...registrarRoutes],
  },
]);
