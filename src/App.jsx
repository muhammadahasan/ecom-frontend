import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import Auth from '@/pages/auth/Auth';
import Dashboard from '@/pages/dashboard/Dashboard';
import Categories from '@/pages/categories/Categories';
import Products from '@/pages/products/Products';
import ProtectedRoute from '@/components/common/ProtectedRoute';

// NEW: Import client-side components
import PublicLayout from './layouts/PublicLayout';
import CategoryPage from './pages/public/CategoryPage';
import HomePage from './pages/public/HomePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Client Routes - NEW */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
          </Route>

          {/* Auth Route */}
          <Route path="/auth" element={<Auth />} />

          {/* Admin Routes - UNCHANGED */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to home instead of auth */}
          <Route path="/" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </Router>
  );
}

export default App;