import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider, CartProvider } from './context';
import { ToastProvider } from './context';

const App = () => {
  return (
    <Router>
      <ToastProvider>
      <AuthProvider>
      <CartProvider>
      <AppRoutes />
        </CartProvider>
      </AuthProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;