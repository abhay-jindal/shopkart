import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import ProductPage from '../pages/ProductPage';
// import CheckoutPage from '../pages/CheckoutPage';
// import MyOrdersPage from '../pages/MyOrdersPage';
import AddressesPage from '../pages/AddressPage';
import { useAuth } from '../context';
import CartPage from '../pages/CartPage';
import PaymentPage from '../pages/PaymentPage';
import OrderSummaryPage from '../pages/OrderSummaryPage';
import OrderHistoryPage from '../pages/OrderHistoryPage';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/addresses" element={
        <ProtectedRoute><AddressesPage /></ProtectedRoute>
      } />
      <Route path="/products" element={<ProductPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/checkout/cart" element={<CartPage />} />
      <Route path="/checkout/payment" element={
        <ProtectedRoute><PaymentPage /></ProtectedRoute>
      } />

      <Route path="/checkout/order/summary" element={
        <ProtectedRoute><OrderSummaryPage /></ProtectedRoute>
      } />
      <Route path="/order/history" element={
        <ProtectedRoute><OrderHistoryPage /></ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;