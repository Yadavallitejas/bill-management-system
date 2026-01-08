
import React from 'react';
import { useLedger } from '../store/LedgerContext';
import { formatCurrency } from '../services/finance';

export const Dashboard: React.FC<{ onViewUser: (id: string) => void }> = ({ onViewUser }) => {
  const { users, bills, transactions, expenses } = useLedger();

  const totalOutstanding = bills.reduce((sum, b) => sum + b.totalAmount, 0) - transactions.reduce((sum, t) => sum + t.paidAmount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const activeBills = bills.length;
  const uniqueUsers = users.length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Outstanding</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-1">{formatCurrency(totalOutstanding)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600 mt-1">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Active Users</h3>
          <p className="text-3xl font-bold text-slate-800 mt-1">{uniqueUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Bills</h3>
          <p className="text-3xl font-bold text-slate-800 mt-1">{activeBills}</p>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Quick User Access</h2>
        </div>
        {users.length === 0 ? (
          <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg py-12 text-center text-slate-500">
            No users registered yet. Go to User Directory to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {users.slice(0, 8).map(user => (
              <button
                key={user.id}
                onClick={() => onViewUser(user.id)}
                className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-indigo-400 hover:shadow transition-all text-left"
              >
                <div className="font-semibold text-slate-800 truncate">{user.name}</div>
                <div className="text-xs text-slate-500 truncate">{user.email}</div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
