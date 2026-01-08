
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: number;
}

export interface Bill {
  id: string;
  userId: string;
  billName: string;
  totalAmount: number;
  dueDate: string;
  createdAt: number;
}

export interface Transaction {
  id: string;
  billId: string;
  paidAmount: number;
  paymentDate: string;
  createdAt: number;
}

export interface BillSummary extends Bill {
  totalPaid: number;
  deficiency: number;
  status: 'unpaid' | 'partial' | 'paid';
}

export interface UserSummary extends User {
  totalBills: number;
  totalDebt: number;
  totalDeficiency: number;
}
