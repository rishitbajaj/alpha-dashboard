import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import ProductList from './pages/ProductList';
import Analytics from './pages/Analytics';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';

// Protect app routes from non-logged-in sessions
function GatewayProtection({ children }) {
  const { role } = useAuth();
  if (!role) return <Navigate to="/login" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public login bypass shell route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected functional administrative context views */}
          <Route path="/" element={<GatewayProtection><ProductList /></GatewayProtection>} />
          <Route path="/analytics" element={<GatewayProtection><Analytics /></GatewayProtection>} />
          <Route path="/product/:id" element={<GatewayProtection><ProductDetail /></GatewayProtection>} />
          
          {/* Universal fallback route safety catch */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}