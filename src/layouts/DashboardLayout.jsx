import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ children }) {
  const currentPath = useLocation().pathname;
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { role, logout } = useAuth(); // <--- Connect Role Engine

  // Conditionally generate nav links base on role
  const navLinks = [
    { label: 'Inventory Ledger', route: '/' },
    ...(role === 'admin' ? [{ label: 'Performance Analytics', route: '/analytics' }] : [])
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-5 shrink-0 fixed h-full justify-between">
        <div className="space-y-6">
          <div className="px-2 flex justify-between items-center">
            <span className="text-sm font-black tracking-wider text-indigo-600 uppercase">Alpha Admin</span>
            <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200">
              {role || 'Guest'}
            </span>
          </div>
          <nav className="space-y-1">
            {navLinks.map(link => (
              <Link 
                key={link.route} 
                to={link.route} 
                className={`block px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                  currentPath === link.route ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-full text-white font-bold flex items-center justify-center text-xs">R</div>
            <span className="text-xs font-bold text-slate-700">Rishit</span>
          </div>
          <button 
            onClick={() => { logout(); navigate('/login'); }} 
            className="text-[10px] text-rose-500 hover:underline font-medium cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER BAR */}
      <div className="flex-1 flex flex-col md:pl-64">
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between md:hidden">
          <span className="text-xs font-black tracking-wider text-indigo-600 uppercase">Alpha Admin</span>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-700 cursor-pointer"
          >
            ☰ Menu
          </button>
        </header>

        {/* MOBILE SLIDEOUT DRAWER MENU */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 md:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-56 bg-white h-full p-4 space-y-4 flex flex-col justify-between" onClick={e => e.stopPropagation()}>
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <span className="text-xs font-black tracking-wider text-indigo-600 uppercase">Alpha Admin</span>
                  <span className="text-[9px] uppercase font-bold bg-slate-100 px-1 text-slate-500 rounded">{role}</span>
                </div>
                <nav className="space-y-1">
                  {navLinks.map(link => (
                    <Link 
                      key={link.route} 
                      to={link.route} 
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-3 py-2 text-xs font-semibold rounded-md ${
                        currentPath === link.route ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="p-2 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-indigo-600 rounded-full text-white font-bold flex items-center justify-center text-[10px]">R</div>
                  <span className="text-xs font-bold text-slate-700">Rishit</span>
                </div>
                <button onClick={() => { logout(); navigate('/login'); }} className="text-[10px] text-rose-500 font-medium">Exit</button>
              </div>
            </div>
          </div>
        )}

        {/* ACCESS SECURITY FILTER GUARD PLACEMENT BLOCK */}
        <main className="p-4 md:p-8 max-w-6xl w-full mx-auto">
          {currentPath === '/analytics' && role !== 'admin' ? (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-xl max-w-md mx-auto">
              <p className="text-xs font-semibold text-rose-600">Access Restricted</p>
              <p className="text-[11px] text-slate-500 mt-1">Your user clearance profile tier holds insufficient capability vectors to evaluate administrative analytics matrices.</p>
            </div>
          ) : children}
        </main>
      </div>
    </div>
  );
}