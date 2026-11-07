import { Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Home } from './pages/Home';
import { ProductList } from './pages/ProductList';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          {/* Nested routes under /products */}
          <Route path="products" element={<Outlet />}>
            <Route index element={<ProductList />} />
            <Route path=":id" element={<ProductDetail />} />
          </Route>

          {/* Protected user shopping cart */}
          <Route
            path="cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          {/* Authentication */}
          <Route path="login" element={<Login />} />

          {/* Catch-all 404 handler inside layout */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
