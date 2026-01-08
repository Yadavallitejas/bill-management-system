
import React, { useState, useMemo } from 'react';
import { useLedger } from '../store/LedgerContext';
import { formatCurrency } from '../services/finance';
import { BillForm, PaymentForm, UserForm } from './Forms';

export const UserDetail: React.FC<{ userId: string, onBack: () => void }> = ({ userId, onBack }) => {
  const { getUserSummary, getUserBills, getBillTransactions, deleteBill } = useLedger();
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [showAddBill, setShowAddBill] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const summary = getUserSummary(userId);
  const bills = getUserBills(userId);

  if (!summary) return <div className="text-center py-12">User not found</div>;

  const handleDeleteBill = (billId: string, billName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the bill "${billName}"?\n\nThis will permanently remove the bill and ALL its associated payment transactions.`
    );
    if (confirmed) {
      deleteBill(billId);
      if (selectedBillId === billId) setSelectedBillId(null);
    }
  };

  const getFilteredTransactions = (billId: string) => {
    const allTx = getBillTransactions(billId);
    if (!startDate && !endDate) return allTx;

    return allTx.filter(tx => {
      const txDate = tx.paymentDate; 
      const afterStart = !startDate || txDate >= startDate;
      const beforeEnd = !endDate || txDate <= endDate;
      return afterStart && beforeEnd;
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex-1">
          <button onClick={onBack} className="text-indigo-600 text-sm font-bold hover:underline flex items-center gap-1 mb-2">
            ← Directory
          </button>
          
          {isEditingProfile ? (
            <div className="max-w-xl mt-4">
              <UserForm 
                initialData={summary} 
                onSuccess={() => setIsEditingProfile(false)} 
              />
              <button 
                onClick={() => setIsEditingProfile(false)}
                className="mt-3 text-sm text-slate-500 hover:text-slate-800 font-medium underline"
              >
                Cancel Editing
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-800">{summary.name}</h1>
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors bg-white rounded-md border border-slate-100 shadow-sm"
                  title="Edit Profile"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-slate-500 mt-1">{summary.email} {summary.phone && `• ${summary.phone}`}</p>
            </div>
          )}
        </div>
        
        {!isEditingProfile && (
          <div className="bg-indigo-50 px-5 py-3 rounded-xl border border-indigo-100 shadow-sm w-full md:w-auto">
            <span className="block text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1 text-center md:text-right">Total Deficiency</span>
            <span className="block text-2xl font-black text-indigo-700 text-center md:text-right leading-none">{formatCurrency(summary.totalDeficiency)}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-800">Billing History</h2>
            <button 
              onClick={() => setShowAddBill(!showAddBill)}
              className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-bold hover:bg-slate-900 transition-all shadow-md"
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
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500 text-sm italic">
              No bills recorded for this user.
            </div>
          ) : (
            <div className="space-y-4">
              {bills.map(bill => (
                <div key={bill.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-all hover:shadow-md">
                  <div className="p-4 sm:p-5 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          <h3 className="font-black text-slate-800 text-lg truncate">{bill.billName}</h3>
                          <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded tracking-tighter ${
                            bill.status === 'paid' ? 'bg-green-100 text-green-700' : 
                            bill.status === 'partial' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {bill.status}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase">Due: {bill.dueDate}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-3 w-full sm:w-auto">
                        <div className="text-center sm:text-right">
                          <span className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Total</span>
                          <span className="text-xs font-bold text-slate-700">{formatCurrency(bill.totalAmount)}</span>
                        </div>
                        <div className="text-center sm:text-right border-x border-slate-50 sm:border-none sm:px-0">
                          <span className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Paid</span>
                          <span className="text-xs font-bold text-green-600">{formatCurrency(bill.totalPaid)}</span>
                        </div>
                        <div className="text-center sm:text-right bg-slate-50 sm:bg-transparent rounded px-1 sm:px-0">
                          <span className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Debt</span>
                          <span className={`text-xs font-black ${bill.deficiency > 0 ? 'text-red-600' : 'text-slate-300'}`}>
                            {formatCurrency(bill.deficiency)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50 gap-2">
                      <button 
                        onClick={() => setSelectedBillId(selectedBillId === bill.id ? null : bill.id)}
                        className={`flex-1 sm:flex-none text-center px-4 py-2 rounded-md text-xs font-black transition-all ${
                          selectedBillId === bill.id 
                            ? 'bg-indigo-600 text-white shadow-inner' 
                            : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                        }`}
                      >
                        {selectedBillId === bill.id ? 'Hide Payments' : 'Manage Bill'}
                      </button>
                      <button 
                        onClick={() => handleDeleteBill(bill.id, bill.billName)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors border border-transparent hover:border-red-100"
                        title="Delete Bill"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {selectedBillId === bill.id && (
                    <div className="bg-slate-50 p-4 sm:p-6 animate-in slide-in-from-top-2 border-t border-slate-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div className="flex flex-col gap-3">
                            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Transaction History</h4>
                            
                            <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                              <span className="text-[9px] font-black text-slate-400 uppercase pl-1">Period:</span>
                              <div className="flex items-center gap-1">
                                <input 
                                  type="date" 
                                  value={startDate} 
                                  onChange={(e) => setStartDate(e.target.value)}
                                  className="text-[10px] border-none p-0 focus:ring-0 w-24 bg-slate-50 rounded px-1 h-6 font-bold"
                                />
                                <span className="text-slate-300">-</span>
                                <input 
                                  type="date" 
                                  value={endDate} 
                                  onChange={(e) => setEndDate(e.target.value)}
                                  className="text-[10px] border-none p-0 focus:ring-0 w-24 bg-slate-50 rounded px-1 h-6 font-bold"
                                />
                              </div>
                              {(startDate || endDate) && (
                                <button 
                                  onClick={() => { setStartDate(''); setEndDate(''); }}
                                  className="ml-auto text-[9px] font-black text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded hover:bg-indigo-50"
                                >
                                  Reset
                                </button>
                              )}
                            </div>
                          </div>

                          {getFilteredTransactions(bill.id).length === 0 ? (
                            <div className="p-6 bg-white rounded-xl border border-dashed border-slate-200 text-center">
                              <p className="text-xs text-slate-400 font-medium">
                                {startDate || endDate ? 'No transactions in this date range.' : 'No payments recorded.'}
                              </p>
                            </div>
                          ) : (
                            <ul className="space-y-2">
                              {getFilteredTransactions(bill.id).map(tx => (
                                <li key={tx.id} className="flex justify-between items-center text-xs p-3 bg-white rounded-lg border border-slate-100 shadow-sm transition-all hover:border-indigo-200">
                                  <span className="text-slate-500 font-bold">{tx.paymentDate}</span>
                                  <span className="font-black text-green-700">+{formatCurrency(tx.paidAmount)}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="pt-4 md:pt-0">
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
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full -mr-16 -mt-16 opacity-20"></div>
            <h2 className="text-xl font-black mb-6 relative z-10">Financial Health</h2>
            <div className="space-y-5 relative z-10">
              <div className="flex justify-between items-center pb-2 border-b border-indigo-500/50">
                <span className="text-xs font-bold uppercase opacity-70 tracking-tighter">Settled Bills</span>
                <span className="text-lg font-black">{bills.filter(b => b.status === 'paid').length}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-indigo-500/50">
                <span className="text-xs font-bold uppercase opacity-70 tracking-tighter">Pending Bills</span>
                <span className="text-lg font-black">{bills.filter(b => b.status !== 'paid').length}</span>
              </div>
              <div className="pt-4 flex flex-col items-center">
                <div className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-2">Completion Rate</div>
                <div className="text-5xl font-black tracking-tighter">
                  {summary.totalDebt > 0 
                    ? Math.round(((summary.totalDebt - summary.totalDeficiency) / summary.totalDebt) * 100) 
                    : 0}%
                </div>
                <div className="w-full bg-indigo-800 h-2.5 rounded-full mt-4 overflow-hidden">
                  <div 
                    className="bg-white h-full transition-all duration-1000" 
                    style={{ width: `${summary.totalDebt > 0 ? ((summary.totalDebt - summary.totalDeficiency) / summary.totalDebt) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
             <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3">Architect's Note</h3>
             <p className="text-xs text-slate-500 leading-relaxed font-medium">
               This ledger automatically calculates <strong className="text-slate-800">Deficiency</strong> by subtracting the sum of all transaction records from the bill's total face value.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
