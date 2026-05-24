import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function DashboardLayout({ children }) { // <--- 1. Make sure '{ children }' is passed here!
  const currentPath = useLocation().pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Inventory Ledger', route: '/' },
    { label: 'Performance Analytics', route: '/analytics' }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-5 shrink-0 fixed h-full justify-between">
        <div className="space-y-6">
          <div className="px-2">
            <span className="text-sm font-black tracking-wider text-indigo-600 uppercase">Alpha Admin</span>
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
        <div className="p-2 border-t border-slate-100 flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-full text-white font-bold flex items-center justify-center text-xs">R</div>
          <span className="text-xs font-bold text-slate-700">Rishit</span>
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
                <span className="text-xs font-black tracking-wider text-indigo-600 uppercase block px-2">Alpha Admin</span>
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
              <div className="p-2 border-t border-slate-100 flex items-center gap-2">
                <div className="w-6 h-6 bg-indigo-600 rounded-full text-white font-bold flex items-center justify-center text-[10px]">R</div>
                <span className="text-xs font-bold text-slate-700">Rishi</span>
              </div>
            </div>
          </div>
        )}

        {/* MAIN DISPLAY VIEWPORT CANVAS */}
        <main className="p-4 md:p-8 max-w-6xl w-full mx-auto">
          {children} {/* <--- 2. Make sure this exact variable token renders right here! */}
        </main>
      </div>
      
    </div>
  );
}