
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Bill, Transaction, UserSummary, BillSummary, Expense } from '../types';
import { getBillSummary } from '../services/finance';

interface LedgerContextType {
  users: User[];
  bills: Bill[];
  transactions: Transaction[];
  expenses: Expense[];
  addUser: (name: string, email: string, phone: string) => void;
  editUser: (id: string, name: string, email: string, phone: string) => void;
  addBill: (userId: string, billName: string, totalAmount: number, dueDate: string) => void;
  deleteBill: (billId: string) => void;
  addTransaction: (billId: string, paidAmount: number, paymentDate: string) => void;
  addExpense: (description: string, amount: number, category: Expense['category'], date: string) => void;
  deleteExpense: (id: string) => void;
  getUserSummary: (userId: string) => UserSummary | null;
  getUserBills: (userId: string) => BillSummary[];
  getBillTransactions: (billId: string) => Transaction[];
  deleteUser: (id: string) => void;
}

const LedgerContext = createContext<LedgerContextType | undefined>(undefined);

export const LedgerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load data from LocalStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('ledger_users');
    const savedBills = localStorage.getItem('ledger_bills');
    const savedTransactions = localStorage.getItem('ledger_transactions');
    const savedExpenses = localStorage.getItem('ledger_expenses');

    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedBills) setBills(JSON.parse(savedBills));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
  }, []);

  // Persist data to LocalStorage
  useEffect(() => {
    localStorage.setItem('ledger_users', JSON.stringify(users));
    localStorage.setItem('ledger_bills', JSON.stringify(bills));
    localStorage.setItem('ledger_transactions', JSON.stringify(transactions));
    localStorage.setItem('ledger_expenses', JSON.stringify(expenses));
  }, [users, bills, transactions, expenses]);

  const addUser = (name: string, email: string, phone: string) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      createdAt: Date.now(),
    };
    setUsers(prev => [...prev, newUser]);
  };

  const editUser = (id: string, name: string, email: string, phone: string) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, name, email, phone } : user
    ));
  };

  const addBill = (userId: string, billName: string, totalAmount: number, dueDate: string) => {
    const newBill: Bill = {
      id: crypto.randomUUID(),
      userId,
      billName,
      totalAmount,
      dueDate,
      createdAt: Date.now(),
    };
    setBills(prev => [...prev, newBill]);
  };

  const deleteBill = (billId: string) => {
    setBills(prev => prev.filter(b => b.id !== billId));
    setTransactions(prev => prev.filter(t => t.billId !== billId));
  };

  const addTransaction = (billId: string, paidAmount: number, paymentDate: string) => {
    const newTx: Transaction = {
      id: crypto.randomUUID(),
      billId,
      paidAmount,
      paymentDate,
      createdAt: Date.now(),
    };
    setTransactions(prev => [...prev, newTx]);
  };

  const addExpense = (description: string, amount: number, category: Expense['category'], date: string) => {
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      description,
      amount,
      category,
      date,
      createdAt: Date.now(),
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    setBills(prev => prev.filter(b => b.userId !== id));
    // Cascade delete transactions logic
    const userBillIds = bills.filter(b => b.userId === id).map(b => b.id);
    setTransactions(prev => prev.filter(t => !userBillIds.includes(t.billId)));
  };

  const getUserSummary = useCallback((userId: string): UserSummary | null => {
    const user = users.find(u => u.id === userId);
    if (!user) return null;

    const userBills = bills.filter(b => b.userId === userId);
    const billSummaries = userBills.map(b => getBillSummary(b, transactions));

    return {
      ...user,
      totalBills: userBills.length,
      totalDebt: billSummaries.reduce((sum, b) => sum + b.totalAmount, 0),
      totalDeficiency: billSummaries.reduce((sum, b) => sum + b.deficiency, 0),
    };
  }, [users, bills, transactions]);

  const getUserBills = useCallback((userId: string): BillSummary[] => {
    return bills
      .filter(b => b.userId === userId)
      .map(b => getBillSummary(b, transactions));
  }, [bills, transactions]);

  const getBillTransactions = useCallback((billId: string): Transaction[] => {
    return transactions
      .filter(t => t.billId === billId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [transactions]);

  return (
    <LedgerContext.Provider value={{
      users, bills, transactions, expenses,
      addUser, editUser, addBill, deleteBill, addTransaction, addExpense, deleteExpense,
      getUserSummary, getUserBills, getBillTransactions, deleteUser
    }}>
      {children}
    </LedgerContext.Provider>
  );
};

export const useLedger = () => {
  const context = useContext(LedgerContext);
  if (!context) throw new Error("useLedger must be used within a LedgerProvider");
  return context;
};
