
import React, { useState } from 'react';
import { useLedger } from '../store/LedgerContext';

export const UserForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { addUser } = useLedger();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    addUser(name, email, phone);
    setName('');
    setEmail('');
    setPhone('');
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-2">Register New User</h3>
      <div>
        <label className="block text-sm font-medium text-slate-700">Full Name</label>
        <input 
          type="text" required
          value={name} onChange={e => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Email Address</label>
        <input 
          type="email" required
          value={email} onChange={e => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Phone Number (Optional)</label>
        <input 
          type="tel"
          value={phone} onChange={e => setPhone(e.target.value)}
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
        />
      </div>
      <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium">
        Save User
      </button>
    </form>
  );
};

export const BillForm: React.FC<{ userId: string, onSuccess: () => void }> = ({ userId, onSuccess }) => {
  const { addBill } = useLedger();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!name || isNaN(numAmount) || !dueDate) return;
    addBill(userId, name, numAmount, dueDate);
    setName('');
    setAmount('');
    setDueDate('');
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 p-6 rounded-lg border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-2">Create New Bill</h3>
      <div>
        <label className="block text-sm font-medium text-slate-700">Bill Name / Description</label>
        <input 
          type="text" required placeholder="e.g. Tuition Fee 2024"
          value={name} onChange={e => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Total Amount</label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input 
            type="number" step="0.01" required
            value={amount} onChange={e => setAmount(e.target.value)}
            className="block w-full rounded-md border-slate-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Due Date</label>
        <input 
          type="date" required
          value={dueDate} onChange={e => setDueDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
        />
      </div>
      <button type="submit" className="w-full bg-slate-800 text-white py-2 px-4 rounded-md hover:bg-slate-900 transition-colors font-medium">
        Generate Bill
      </button>
    </form>
  );
};

export const PaymentForm: React.FC<{ billId: string, onSuccess: () => void }> = ({ billId, onSuccess }) => {
  const { addTransaction } = useLedger();
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || !date) return;
    addTransaction(billId, numAmount, date);
    setAmount('');
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-indigo-50 p-6 rounded-lg border border-indigo-100">
      <h3 className="text-lg font-bold text-indigo-900 mb-2">Record Payment</h3>
      <div>
        <label className="block text-sm font-medium text-indigo-700">Payment Amount</label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input 
            type="number" step="0.01" required
            value={amount} onChange={e => setAmount(e.target.value)}
            className="block w-full rounded-md border-indigo-200 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-indigo-700">Payment Date</label>
        <input 
          type="date" required
          value={date} onChange={e => setDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
        />
      </div>
      <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium">
        Post Transaction
      </button>
    </form>
  );
};
