
import React, { useState } from 'react';
import { useLedger } from '../store/LedgerContext';
import { UserForm } from './Forms';
import { formatCurrency } from '../services/finance';

export const UserDirectory: React.FC<{ onSelectUser: (id: string) => void }> = ({ onSelectUser }) => {
  const { users, getUserSummary } = useLedger();
  const [showAdd, setShowAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage debtors and their associated account summaries.</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          {showAdd ? 'Close' : '+ Register User'}
        </button>
      </div>

      {showAdd && (
        <div className="max-w-xl animate-in fade-in slide-in-from-top-2">
          <UserForm onSuccess={() => setShowAdd(false)} />
        </div>
      )}

      <div className="relative max-w-md w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm transition-all"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Desktop View Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User Details</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Bills</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Deficiency</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                  No users found matching your search.
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => {
                const summary = getUserSummary(user.id);
                return (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {summary?.totalBills || 0} bills
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${summary?.totalDeficiency ? 'text-red-600' : 'text-slate-400'}`}>
                        {formatCurrency(summary?.totalDeficiency || 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onSelectUser(user.id)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-bold transition-colors"
                      >
                        View Ledger
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View Cards */}
      <div className="md:hidden space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500 text-sm">
            No users found.
          </div>
        ) : (
          filteredUsers.map(user => {
            const summary = getUserSummary(user.id);
            return (
              <div key={user.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900">{user.name}</h3>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-800 uppercase">
                    {summary?.totalBills || 0} bills
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-y border-slate-50">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Deficiency</span>
                  <span className={`text-lg font-bold ${summary?.totalDeficiency ? 'text-red-600' : 'text-slate-400'}`}>
                    {formatCurrency(summary?.totalDeficiency || 0)}
                  </span>
                </div>
                <button 
                  onClick={() => onSelectUser(user.id)}
                  className="w-full py-2.5 bg-indigo-50 text-indigo-700 rounded-md font-bold text-sm hover:bg-indigo-100 transition-colors"
                >
                  View Full Ledger
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
