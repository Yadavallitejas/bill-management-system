
import { Bill, Transaction, BillSummary } from '../types';

/**
 * Calculates the total paid amount for a specific bill based on its transactions.
 */
export const calculateTotalPaid = (billId: string, transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.billId === billId)
    .reduce((sum, t) => sum + t.paidAmount, 0);
};

/**
 * Computes the deficiency (outstanding balance) for a bill.
 * Deficiency = total_amount - sum(paid_amounts)
 */
export const calculateDeficiency = (totalAmount: number, totalPaid: number): number => {
  const diff = totalAmount - totalPaid;
  return diff > 0 ? diff : 0;
};

/**
 * Generates a full summary for a bill including its payment status.
 */
export const getBillSummary = (bill: Bill, transactions: Transaction[]): BillSummary => {
  const totalPaid = calculateTotalPaid(bill.id, transactions);
  const deficiency = calculateDeficiency(bill.totalAmount, totalPaid);
  
  let status: BillSummary['status'] = 'unpaid';
  if (totalPaid >= bill.totalAmount) {
    status = 'paid';
  } else if (totalPaid > 0) {
    status = 'partial';
  }

  return {
    ...bill,
    totalPaid,
    deficiency,
    status
  };
};

/**
 * Formatting utility for currency.
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
