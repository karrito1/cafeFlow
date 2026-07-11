import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import MenuPage from '../pages/menu/MenuPage';
import PromotionsPage from '../pages/menu/PromotionsPage';
import ProductListPage from '../pages/products/ProductListPage';
import ProductFormPage from '../pages/products/ProductFormPage';
import CategoryListPage from '../pages/categories/CategoryListPage';
import CategoryFormPage from '../pages/categories/CategoryFormPage';
import OrderListPage from '../pages/orders/OrderListPage';
import OrderDetailPage from '../pages/orders/OrderDetailPage';
import CreateOrderPage from '../pages/orders/CreateOrderPage';
import TableListPage from '../pages/tables/TableListPage';
import TableDetailPage from '../pages/tables/TableDetailPage';
import PaymentPage from '../pages/payments/PaymentPage';
import CustomerListPage from '../pages/customers/CustomerListPage';
import CustomerDetailPage from '../pages/customers/CustomerDetailPage';
import RewardListPage from '../pages/rewards/RewardListPage';

import UserListPage from '../pages/users/UserListPage';
import UserFormPage from '../pages/users/UserFormPage';
import SalesReportPage from '../pages/reports/SalesReportPage';
import NotFoundPage from '../pages/NotFoundPage';

const LandingPage = lazy(() => import('../pages/landing/LandingPage'));
const LandingHeader = lazy(() => import('../components/landing/Header'));
const LandingFooter = lazy(() => import('../components/landing/Footer'));

function AppRouter() {
  return (
    <BrowserRouter>
      <HelmetProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/promotions" element={<PromotionsPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {/* Acceso para todos los roles autenticados */}
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/tables" element={<TableListPage />} />
            <Route path="/tables/:id" element={<TableDetailPage />} />
            <Route path="/orders" element={<OrderListPage />} />
            <Route path="/orders/new" element={<CreateOrderPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />

            {/* Acceso solo admin */}
            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/products/new" element={<ProductFormPage />} />
              <Route path="/products/:id/edit" element={<ProductFormPage />} />
              <Route path="/categories" element={<CategoryListPage />} />
              <Route path="/categories/new" element={<CategoryFormPage />} />
              <Route path="/categories/:id/edit" element={<CategoryFormPage />} />
              <Route path="/payments" element={<PaymentPage />} />
              <Route path="/customers" element={<CustomerListPage />} />
              <Route path="/customers/:id" element={<CustomerDetailPage />} />
              <Route path="/rewards" element={<RewardListPage />} />
              <Route path="/users" element={<UserListPage />} />
              <Route path="/users/new" element={<UserFormPage />} />
              <Route path="/users/:id/edit" element={<UserFormPage />} />
              <Route path="/reports/sales" element={<SalesReportPage />} />
            </Route>
          </Route>
        </Route>

        <Route
          path="/"
          element={
            <Suspense fallback={null}>
              <div className="landing-theme flex flex-col min-h-screen">
                <LandingHeader />
                <main className="flex-grow">
                  <LandingPage />
                </main>
                <LandingFooter />
              </div>
            </Suspense>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default AppRouter;
