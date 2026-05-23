import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import ProductList from './pages/ProductList';
import Analytics from './pages/Analytics'; 

export default function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}