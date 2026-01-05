import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { api } from '@/utils/apiClient';
import { Transaction, FilterOptions, PaginatedResponse } from '@/types';

// Types

interface TransactionState {
    transactions: Transaction[];
    pagination: PaginatedResponse<Transaction> | null;
    loading: boolean;
    error: string | null;
    lastUpdated: string | null;
}

// Action Types
type TransactionAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_TRANSACTIONS'; payload: { transactions: Transaction[]; pagination: PaginatedResponse<Transaction> | null } }
    | { type: 'ADD_TRANSACTION'; payload: Transaction }
    | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
    | { type: 'DELETE_TRANSACTION'; payload: number }
    | { type: 'REFRESH_TRANSACTIONS' }
    | { type: 'SET_LAST_UPDATED'; payload: string };

// Initial State
const initialState: TransactionState = {
    transactions: [],
    pagination: null,
    loading: false,
    error: null,
    lastUpdated: null,
};

// Reducer
const transactionReducer = (state: TransactionState, action: TransactionAction): TransactionState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        
        case 'SET_TRANSACTIONS':
            return {
                ...state,
                transactions: action.payload.transactions,
                pagination: action.payload.pagination,
                loading: false,
                error: null,
                lastUpdated: new Date().toISOString(),
            };
        
        case 'ADD_TRANSACTION': {
            const updatedTransactions = [action.payload, ...state.transactions];
            const updatedPagination = state.pagination
                ? (() => {
                    const perPage = state.pagination.per_page ?? updatedTransactions.length;
                    const startIndex = (state.pagination.current_page - 1) * perPage;
                    const updatedData = [action.payload, ...state.pagination.data].slice(0, perPage);
                    const hasData = updatedData.length > 0;

                    return {
                        ...state.pagination,
                        data: updatedData,
                        total: (state.pagination.total ?? state.pagination.data.length) + 1,
                        from: hasData ? startIndex + 1 : 0,
                        to: hasData ? startIndex + updatedData.length : 0,
                    };
                })()
                : null;

            return {
                ...state,
                transactions: updatedTransactions,
                pagination: updatedPagination,
                lastUpdated: new Date().toISOString(),
            };
        }
        
        case 'UPDATE_TRANSACTION': {
            const updatedTransactions = state.transactions.map(t => 
                t.id === action.payload.id ? action.payload : t
            );

            const updatedPagination = state.pagination
                ? {
                    ...state.pagination,
                    data: state.pagination.data.map(t => 
                        t.id === action.payload.id ? action.payload : t
                    ),
                }
                : null;

            return {
                ...state,
                transactions: updatedTransactions,
                pagination: updatedPagination,
                lastUpdated: new Date().toISOString(),
            };
        }
        
        case 'DELETE_TRANSACTION': {
            const updatedTransactions = state.transactions.filter(t => t.id !== action.payload);
            const updatedPagination = state.pagination
                ? (() => {
                    const perPage = state.pagination.per_page ?? updatedTransactions.length;
                    const startIndex = (state.pagination.current_page - 1) * perPage;
                    const updatedData = state.pagination.data.filter(t => t.id !== action.payload);
                    const hasData = updatedData.length > 0;

                    return {
                        ...state.pagination,
                        data: updatedData,
                        total: Math.max((state.pagination.total ?? updatedData.length + 1) - 1, 0),
                        from: hasData ? startIndex + 1 : 0,
                        to: hasData ? startIndex + updatedData.length : 0,
                    };
                })()
                : null;

            return {
                ...state,
                transactions: updatedTransactions,
                pagination: updatedPagination,
                lastUpdated: new Date().toISOString(),
            };
        }
        
        case 'REFRESH_TRANSACTIONS':
            return {
                ...state,
                loading: true,
                error: null,
            };
        
        case 'SET_LAST_UPDATED':
            return {
                ...state,
                lastUpdated: action.payload,
            };
        
        default:
            return state;
    }
};

// Context
interface TransactionContextType {
    state: TransactionState;
    actions: {
        fetchTransactions: (filters?: FilterOptions) => Promise<PaginatedResponse<Transaction> | null>;
        addTransaction: (transaction: Transaction) => void;
        updateTransaction: (transaction: Transaction) => void;
        deleteTransaction: (id: number) => void;
        refreshTransactions: () => void;
        clearError: () => void;
    };
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Provider Component
interface TransactionProviderProps {
    children: ReactNode;
    initialTransactions?: Transaction[];
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ 
    children, 
    initialTransactions = [] 
}) => {
    const initialPagination: PaginatedResponse<Transaction> | null = initialTransactions.length
        ? {
            data: initialTransactions,
            current_page: 1,
            last_page: 1,
            per_page: initialTransactions.length,
            total: initialTransactions.length,
            from: 1,
            to: initialTransactions.length,
        }
        : null;

    const [state, dispatch] = useReducer(transactionReducer, {
        ...initialState,
        transactions: initialTransactions,
        pagination: initialPagination,
    }, () => ({
        ...initialState,
        transactions: initialTransactions,
        pagination: initialPagination,
    }));

    // Actions
    const fetchTransactions = useCallback(async (filters?: FilterOptions) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            dispatch({ type: 'SET_ERROR', payload: null });

            const paramsEntries = Object.entries({
                per_page: filters?.per_page ?? 25,
                ...filters,
            }).filter(([, value]) => value !== undefined && value !== null && value !== '');

            const response = await api.get('/api/transactions', {
                params: Object.fromEntries(paramsEntries),
            });

            const payload = response.data;
            const transactionsPayload = payload?.transactions;

            let pagination: PaginatedResponse<Transaction> | null = null;
            let transactionData: Transaction[] = [];

            if (Array.isArray(transactionsPayload)) {
                transactionData = transactionsPayload;
                const count = transactionData.length;
                pagination = {
                    data: transactionData,
                    current_page: 1,
                    last_page: 1,
                    per_page: count || (filters?.per_page ?? 25),
                    total: count,
                    from: count ? 1 : 0,
                    to: count,
                };
            } else if (transactionsPayload && typeof transactionsPayload === 'object') {
                const {
                    data = [],
                    current_page = 1,
                    last_page = 1,
                    per_page: rawPerPage,
                    total: rawTotal,
                    from: rawFrom,
                    to: rawTo,
                } = transactionsPayload;

                transactionData = data;

                const sanitizedPerPageCandidate = Number(rawPerPage);
                const sanitizedPerPage = Number.isFinite(sanitizedPerPageCandidate)
                    ? sanitizedPerPageCandidate
                    : Number(filters?.per_page) || (Array.isArray(data) ? data.length || 25 : 25);

                const sanitizedTotalCandidate = Number(rawTotal);
                const sanitizedFromCandidate = Number(rawFrom);
                const sanitizedToCandidate = Number(rawTo);

                pagination = {
                    data,
                    current_page: Number(current_page) || 1,
                    last_page: Number(last_page) || 1,
                    per_page: sanitizedPerPage,
                    total: Number.isFinite(sanitizedTotalCandidate) ? sanitizedTotalCandidate : data.length,
                    from: Number.isFinite(sanitizedFromCandidate)
                        ? sanitizedFromCandidate
                        : (data.length ? 1 : 0),
                    to: Number.isFinite(sanitizedToCandidate) ? sanitizedToCandidate : data.length,
                };
            }

            dispatch({ type: 'SET_TRANSACTIONS', payload: { transactions: transactionData, pagination } });

            return pagination;
        } catch {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch transactions' });
            return null;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const addTransaction = useCallback((transaction: Transaction) => {
        dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    }, []);

    const updateTransaction = useCallback((transaction: Transaction) => {
        dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
    }, []);

    const deleteTransaction = useCallback((id: number) => {
        dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    }, []);

    const refreshTransactions = useCallback(() => {
        dispatch({ type: 'REFRESH_TRANSACTIONS' });
        fetchTransactions();
    }, [fetchTransactions]);

    const clearError = useCallback(() => {
        dispatch({ type: 'SET_ERROR', payload: null });
    }, []);

    const contextValue: TransactionContextType = {
        state,
        actions: {
            fetchTransactions,
            addTransaction,
            updateTransaction,
            deleteTransaction,
            refreshTransactions,
            clearError,
        },
    };

    return (
        <TransactionContext.Provider value={contextValue}>
            {children}
        </TransactionContext.Provider>
    );
};

// Custom Hook
export const useTransactions = (): TransactionContextType => {
    const context = useContext(TransactionContext);
    if (context === undefined) {
        throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
};

// Additional Hooks for Specific Use Cases
export const useTransactionActions = () => {
    const { actions } = useTransactions();
    return actions;
};

export const useTransactionState = () => {
    const { state } = useTransactions();
    return state;
};

export default TransactionContext;
