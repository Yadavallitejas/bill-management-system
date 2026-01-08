
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode, onNavigate: (view: string) => void, activeView: string }> = ({ children, onNavigate, activeView }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-indigo-700 font-bold">L</div>
              <span className="text-xl font-bold tracking-tight">DebtLedger Pro</span>
            </div>
            <nav className="flex space-x-4">
              <button 
                onClick={() => onNavigate('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeView === 'dashboard' ? 'bg-indigo-800' : 'hover:bg-indigo-600'}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => onNavigate('users')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeView === 'users' ? 'bg-indigo-800' : 'hover:bg-indigo-600'}`}
              >
                User Directory
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Debt Management System • Simple Academic Ledger
        </div>
      </footer>
    </div>
  );
};
