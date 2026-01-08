
import React, { useState } from 'react';
import { useLedger } from '../store/LedgerContext';
import { formatCurrency } from '../services/finance';
import { ExpenseForm } from './Forms';

export const Expenses: React.FC = () => {
  const { expenses, deleteExpense } = useLedger();
  const [showAdd, setShowAdd] = useState(false);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Expense Management</h1>
          <p className="text-slate-500 text-sm mt-1">Track internal operational costs and general spending.</p>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
          <div className="text-left sm:text-right">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
            <span className="text-xl font-bold text-slate-800 leading-tight">{formatCurrency(totalExpenses)}</span>
          </div>
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            {showAdd ? 'Close' : '+ Add Expense'}
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="max-w-xl animate-in fade-in slide-in-from-top-2">
          <ExpenseForm onSuccess={() => setShowAdd(false)} />
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">No expenses recorded yet.</td>
              </tr>
            ) : (
              expenses.sort((a,b) => b.date.localeCompare(a.date)).map(expense => (
                <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{expense.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{expense.description}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-slate-100 text-slate-600">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{formatCurrency(expense.amount)}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteExpense(expense.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {expenses.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500 text-sm">
            No expenses recorded yet.
          </div>
        ) : (
          expenses.sort((a,b) => b.date.localeCompare(a.date)).map(expense => (
            <div key={expense.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{expense.date}</span>
                  <h3 className="font-bold text-slate-800 leading-tight">{expense.description}</h3>
                </div>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded bg-indigo-50 text-indigo-600">
                  {expense.category}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                <span className="text-lg font-black text-slate-800">{formatCurrency(expense.amount)}</span>
                <button 
                  onClick={() => deleteExpense(expense.id)}
                  className="p-2 text-red-400 bg-red-50 rounded-full hover:bg-red-100 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
