import { create } from 'zustand';
import { Transaction, Category, BudgetSummary, CategorySpending, MonthlySpending } from '@/types';

// Default categories
export const defaultCategories: Category[] = [
  { id: '1', name: 'Makanan', color: '#ef4444', icon: '🍔' },
  { id: '2', name: 'Transportasi', color: '#3b82f6', icon: '🚗' },
  { id: '3', name: 'Hiburan', color: '#8b5cf6', icon: '🎬' },
  { id: '4', name: 'Belanja', color: '#10b981', icon: '🛍️' },
  { id: '5', name: 'Kesehatan', color: '#f59e0b', icon: '🏥' },
  { id: '6', name: 'Pendidikan', color: '#06b6d4', icon: '📚' },
  { id: '7', name: 'Gaji', color: '#22c55e', icon: '💰' },
  { id: '8', name: 'Lainnya', color: '#6b7280', icon: '📝' },
];

// Sample initial transactions
const initialTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Gaji Bulanan',
    amount: 5000000,
    date: '2024-01-01',
    category: defaultCategories[6],
    type: 'income'
  },
  {
    id: '2',
    description: 'Makan Siang',
    amount: 25000,
    date: '2024-01-02',
    category: defaultCategories[0],
    type: 'expense'
  },
  {
    id: '3',
    description: 'Bensin',
    amount: 100000,
    date: '2024-01-03',
    category: defaultCategories[1],
    type: 'expense'
  },
  {
    id: '4',
    description: 'Nonton Bioskop',
    amount: 75000,
    date: '2024-01-04',
    category: defaultCategories[2],
    type: 'expense'
  },
  {
    id: '5',
    description: 'Belanja Bulanan',
    amount: 500000,
    date: '2024-01-05',
    category: defaultCategories[3],
    type: 'expense'
  },
];

interface BudgetStore {
  transactions: Transaction[];
  categories: Category[];
  
  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  
  // Getters
  getBudgetSummary: () => BudgetSummary;
  getCategorySpending: () => CategorySpending[];
  getMonthlySpending: () => MonthlySpending[];
  getTransactionsByCategory: (categoryId: string) => Transaction[];
  getTransactionsByDateRange: (startDate: string, endDate: string) => Transaction[];
  getHighestTransaction: () => Transaction | null;
}

export const useBudgetStore = create<BudgetStore>()(
  (set, get) => {
    // Try to load from localStorage on client side
    const loadFromStorage = () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('budget-storage');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            return parsed.state || { transactions: initialTransactions, categories: defaultCategories };
          } catch (error) {
            console.error('Error loading from storage:', error);
          }
        }
      }
      return { transactions: initialTransactions, categories: defaultCategories };
    };

    const saveToStorage = (state: BudgetStore) => {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('budget-storage', JSON.stringify({ state }));
        } catch (error) {
          console.error('Error saving to storage:', error);
        }
      }
    };

    const initialState = loadFromStorage();

    return {
      transactions: initialState.transactions,
      categories: initialState.categories,
      
      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: Date.now().toString(),
        };
        set((state) => {
          const newState = {
            transactions: [...state.transactions, newTransaction],
            categories: state.categories,
          };
          saveToStorage({ ...newState, ...get() });
          return newState;
        });
      },
      
      updateTransaction: (id, updatedTransaction) => {
        set((state) => {
          const newState = {
            transactions: state.transactions.map((transaction) =>
              transaction.id === id ? { ...updatedTransaction, id } : transaction
            ),
            categories: state.categories,
          };
          saveToStorage({ ...newState, ...get() });
          return newState;
        });
      },
      
      deleteTransaction: (id) => {
        set((state) => {
          const newState = {
            transactions: state.transactions.filter((transaction) => transaction.id !== id),
            categories: state.categories,
          };
          saveToStorage({ ...newState, ...get() });
          return newState;
        });
      },
      
      getBudgetSummary: () => {
        const { transactions } = get();
        const totalIncome = transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        const balance = totalIncome - totalExpense;
        
        return { totalIncome, totalExpense, balance };
      },
      
      getCategorySpending: () => {
        const { transactions, categories } = get();
        const expenses = transactions.filter((t) => t.type === 'expense');
        const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
        
        return categories.map((category) => {
          const categoryTotal = expenses
            .filter((t) => t.category.id === category.id)
            .reduce((sum, t) => sum + t.amount, 0);
          
          return {
            category,
            totalAmount: categoryTotal,
            percentage: totalExpense > 0 ? (categoryTotal / totalExpense) * 100 : 0,
          };
        });
      },
      
      getMonthlySpending: () => {
        const { transactions } = get();
        const monthlyData: { [key: string]: number } = {};
        
        transactions
          .filter((t) => t.type === 'expense')
          .forEach((transaction) => {
            const month = new Date(transaction.date).toISOString().slice(0, 7);
            monthlyData[month] = (monthlyData[month] || 0) + transaction.amount;
          });
        
        return Object.entries(monthlyData)
          .map(([month, amount]) => ({ month, amount }))
          .sort((a, b) => a.month.localeCompare(b.month));
      },
      
      getTransactionsByCategory: (categoryId) => {
        return get().transactions.filter((t) => t.category.id === categoryId);
      },
      
      getTransactionsByDateRange: (startDate, endDate) => {
        return get().transactions.filter((t) => {
          const transactionDate = new Date(t.date);
          const start = new Date(startDate);
          const end = new Date(endDate);
          return transactionDate >= start && transactionDate <= end;
        });
      },
      
      getHighestTransaction: () => {
        const { transactions } = get();
        const expenses = transactions.filter((t) => t.type === 'expense');
        
        if (expenses.length === 0) {
          return null;
        }
        
        return expenses.reduce((highest, current) => 
          current.amount > highest.amount ? current : highest
        );
      },
    };
  }
);