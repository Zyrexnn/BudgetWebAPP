export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: Category;
  type: 'income' | 'expense';
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface BudgetSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategorySpending {
  category: Category;
  totalAmount: number;
  percentage: number;
}

export interface MonthlySpending {
  month: string;
  amount: number;
}