import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { seedTransactions } from '../data/mockData';
import { DashboardFilters, Transaction, UserRole } from '../types';

interface DashboardState {
  role: UserRole;
  transactions: Transaction[];
  filters: DashboardFilters;
}

type Action =
  | { type: 'SET_ROLE'; payload: UserRole }
  | { type: 'SET_FILTERS'; payload: Partial<DashboardFilters> }
  | { type: 'RESET_FILTERS' }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction };

interface DashboardContextValue extends DashboardState {
  setRole: (role: UserRole) => void;
  setFilters: (filters: Partial<DashboardFilters>) => void;
  resetFilters: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  categories: string[];
}

const defaultFilters: DashboardFilters = {
  search: '',
  category: 'all',
  type: 'all',
  month: 'all',
  sortBy: 'date-desc',
};

const storageKey = 'finance-dashboard-state-v1';

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

function reducer(state: DashboardState, action: Action): DashboardState {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    case 'RESET_FILTERS':
      return { ...state, filters: defaultFilters };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((tx) =>
          tx.id === action.payload.id ? action.payload : tx,
        ),
      };
    default:
      return state;
  }
}

function getInitialState(): DashboardState {
  const initialState: DashboardState = {
    role: 'viewer',
    transactions: seedTransactions,
    filters: defaultFilters,
  };

  try {
    const rawState = localStorage.getItem(storageKey);
    if (!rawState) {
      return initialState;
    }

    const parsed = JSON.parse(rawState) as Partial<DashboardState>;
    return {
      role: parsed.role === 'admin' ? 'admin' : 'viewer',
      transactions: Array.isArray(parsed.transactions)
        ? parsed.transactions
        : seedTransactions,
      filters: { ...defaultFilters, ...(parsed.filters ?? {}) },
    };
  } catch {
    return initialState;
  }
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  const categories = useMemo(() => {
    const allCategories = state.transactions.map((tx: Transaction) => tx.category);
    return Array.from(new Set(allCategories)).sort((a, b) => a.localeCompare(b));
  }, [state.transactions]);

  const value: DashboardContextValue = {
    ...state,
    setRole: (role) => dispatch({ type: 'SET_ROLE', payload: role }),
    setFilters: (filters) => dispatch({ type: 'SET_FILTERS', payload: filters }),
    resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),
    addTransaction: (transaction) => {
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: {
          ...transaction,
          id: `tx-${Date.now()}`,
        },
      });
    },
    updateTransaction: (transaction) =>
      dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction }),
    categories,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}
