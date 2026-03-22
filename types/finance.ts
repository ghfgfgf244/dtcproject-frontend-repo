// src/types/finance.ts

export type TransactionStatus = 'Completed' | 'Pending' | 'Refunded';

export interface FinanceKpi {
  id: string;
  title: string;
  value: string;
  trendValue: string;
  trendType: 'up' | 'down';
  icon: 'payments' | 'pending' | 'enrollments';
}

export interface Transaction {
  id: string;
  studentName: string;
  avatar: string;
  licenseType: string;
  date: string;
  amount: number;
  status: TransactionStatus;
}