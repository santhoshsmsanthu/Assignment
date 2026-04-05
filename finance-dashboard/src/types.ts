export type UserRole = 'viewer' | 'admin';
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
}

export interface DashboardFilters {
  search: string;
  category: string;
  type: 'all' | TransactionType;
  month: string;
  sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
}
