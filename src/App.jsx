import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import ProductList from './pages/ProductList';

const PlaceholderAnalytics = () => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
    <h2 className="text-base font-bold text-slate-900">Analytics Overview Panel</h2>
    <p className="text-xs text-slate-500 mt-1">Layout confirmed. Phase 6 metrics summary will render here.</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/analytics" element={<PlaceholderAnalytics />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}