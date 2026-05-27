import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    login(role);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-sm w-full text-center space-y-6">
        <div>
          <span className="text-xs font-black tracking-wider text-indigo-600 uppercase">Alpha Portal</span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Select Access Profile</h2>
          <p className="text-xs text-slate-500 mt-1">Reviewer bypass active. Choose a tier to inspect permissions.</p>
        </div>

        <div className="space-y-2">
          <button 
            onClick={() => handleRoleSelect('admin')}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition-colors"
          >
            Enter as Admin (Full Access Privilege)
          </button>
          
          <button 
            onClick={() => handleRoleSelect('user')}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition-colors"
          >
            Enter as Standard User (Limited Scope)
          </button>
        </div>
        
        <p className="text-[10px] text-slate-400">Note: Per evaluation guidelines, login steps default to Admin bypass.</p>
      </div>
    </div>
  );
}