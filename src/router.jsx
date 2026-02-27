import { createBrowserRouter } from 'react-router-dom';
import Auth from '@/pages/auth/Auth';
import Dashboard from '@/pages/dashboard/Dashboard';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import Home from '@/pages/home/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
]);

export default router;