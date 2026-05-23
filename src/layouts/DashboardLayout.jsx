import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentPath = useLocation().pathname;
  const navigationPaths = [
    { label: 'Inventory Ledger', route: '/', indicator: '📋' },
    { label: 'Performance Analytics', route: '/analytics', indicator: '📈' }
  ];

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
    
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 fixed inset-y-0 left-0 p-5 z-20">

        <div className="flex items-center gap-2.5 mb-8 px-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold text-xs shadow-xs">α</div>
          <span className="font-semibold text-slate-900 tracking-tight text-sm">Alpha Admin</span>
        </div>
        <nav className="space-y-1 flex-1">
          {navigationPaths.map(p => (
            <Link 
              key={p.route} 
              to={p.route} 
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPath === p.route 
                  ? 'bg-indigo-50/70 text-indigo-700 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="text-base">{p.indicator}</span>
              {p.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-100 pt-4 flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-700 border border-indigo-200">
            RS
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800 truncate">Rishi</p>
            <p className="text-[10px] text-slate-400 font-medium truncate">Store Architect</p>
          </div>
        </div>
      </aside>
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0 backdrop-blur-xs bg-white/95">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="p-1.5 lg:hidden text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-md transition-colors font-medium text-xs flex items-center gap-1"
          >
            <span>☰</span> Menu
          </button>
          
          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            Operational Hub Index / Store Ledger Management
          </div>
          
          <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-xs cursor-pointer hover:bg-slate-100 transition-colors">
            🔔
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">

            <div 
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity duration-200" 
              onClick={() => setMobileMenuOpen(false)} 
            />
            
            <div className="relative w-64 max-w-xs bg-white p-5 flex flex-col h-full shadow-2xl transition-transform duration-200 ease-out border-r border-slate-100">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                <span className="font-semibold text-xs tracking-wider text-slate-400 uppercase">Navigation Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-700 text-sm p-1">✕</button>
              </div>
              
              <nav className="space-y-1.5 flex-1">
                {navigationPaths.map(p => (
                  <Link 
                    key={p.route} 
                    to={p.route} 
                    onClick={() => setMobileMenuOpen(false)} 
                    className={`flex items-center gap-3 p-2.5 text-sm rounded-lg font-medium transition-colors ${
                      currentPath === p.route 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{p.indicator}</span>
                    {p.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
        <main className="p-4 lg:p-8 max-w-7xl w-full mx-auto flex-1 focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}