
import React, { useState } from 'react';
import { useLedger } from '../store/LedgerContext';
import { formatCurrency } from '../services/finance';
import { BillForm, PaymentForm } from './Forms';

export const UserDetail: React.FC<{ userId: string, onBack: () => void }> = ({ userId, onBack }) => {
  const { getUserSummary, getUserBills, getBillTransactions } = useLedger();
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [showAddBill, setShowAddBill] = useState(false);

  const summary = getUserSummary(userId);
  const bills = getUserBills(userId);

  if (!summary) return <div className="text-center py-12">User not found</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <button onClick={onBack} className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1 mb-2">
            ← Back to Directory
          </button>
          <h1 className="text-3xl font-bold text-slate-800">{summary.name}</h1>
          <p className="text-slate-500">{summary.email} • {summary.phone || 'No phone'}</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-indigo-50 px-4 py-2 rounded-lg text-right border border-indigo-100">
            <span className="block text-xs font-medium text-indigo-600 uppercase">Total Deficiency</span>
            <span className="text-xl font-bold text-indigo-700">{formatCurrency(summary.totalDeficiency)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Billing History</h2>
            <button 
              onClick={() => setShowAddBill(!showAddBill)}
              className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm hover:bg-slate-900 transition-all"
            >
              {showAddBill ? 'Cancel' : '+ New Bill'}
            </button>
          </div>

          {showAddBill && (
            <div className="mb-6">
              <BillForm userId={userId} onSuccess={() => setShowAddBill(false)} />
            </div>
          )}

          {bills.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500">
              No bills recorded for this user.
            </div>
          ) : (
            <div className="space-y-4">
              {bills.map(bill => (
                <div key={bill.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-slate-800 text-lg">{bill.billName}</h3>
                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                          bill.status === 'paid' ? 'bg-green-100 text-green-700' : 
                          bill.status === 'partial' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {bill.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">Due: {bill.dueDate}</p>
                    </div>
                    <div className="flex gap-6 text-right">
                      <div>
                        <span className="block text-xs text-slate-400">Total</span>
                        <span className="font-semibold">{formatCurrency(bill.totalAmount)}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-slate-400">Paid</span>
                        <span className="font-semibold text-green-600">{formatCurrency(bill.totalPaid)}</span>
                      </div>
                      <div className="bg-slate-50 px-3 py-1 rounded">
                        <span className="block text-xs text-slate-400">Deficiency</span>
                        <span className={`font-bold ${bill.deficiency > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                          {formatCurrency(bill.deficiency)}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedBillId(selectedBillId === bill.id ? null : bill.id)}
                      className="px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded text-sm font-medium"
                    >
                      {selectedBillId === bill.id ? 'Hide Payments' : 'Manage'}
                    </button>
                  </div>

                  {selectedBillId === bill.id && (
                    <div className="bg-slate-50 p-5 animate-in slide-in-from-top-2 border-t border-slate-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Transaction History</h4>
                          {getBillTransactions(bill.id).length === 0 ? (
                            <p className="text-sm text-slate-400 italic">No payments recorded.</p>
                          ) : (
                            <ul className="space-y-2">
                              {getBillTransactions(bill.id).map(tx => (
                                <li key={tx.id} className="flex justify-between items-center text-sm p-2 bg-white rounded border border-slate-100">
                                  <span className="text-slate-500">{tx.paymentDate}</span>
                                  <span className="font-bold text-green-700">+{formatCurrency(tx.paidAmount)}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div>
                          <PaymentForm billId={bill.id} onSuccess={() => {}} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-lg">
            <h2 className="text-lg font-bold mb-4">Financial Health</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-indigo-500">
                <span className="opacity-80">Settled Bills</span>
                <span className="font-bold">{bills.filter(b => b.status === 'paid').length}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-indigo-500">
                <span className="opacity-80">Pending Bills</span>
                <span className="font-bold">{bills.filter(b => b.status !== 'paid').length}</span>
              </div>
              <div className="pt-2 text-center">
                <div className="text-xs opacity-80 mb-1">Total Paid %</div>
                <div className="text-2xl font-black">
                  {summary.totalDebt > 0 
                    ? Math.round(((summary.totalDebt - summary.totalDeficiency) / summary.totalDebt) * 100) 
                    : 0}%
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-6">
             <h3 className="font-bold text-slate-800 mb-2">Architect's Note</h3>
             <p className="text-sm text-slate-500 leading-relaxed">
               This ledger automatically calculates <strong>Deficiency</strong> by subtracting the sum of all transaction records from the bill's total face value. Payments are stored as immutable ledger entries.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
