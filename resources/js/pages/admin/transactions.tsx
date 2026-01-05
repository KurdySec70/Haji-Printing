import { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, PaginatedResponse, Transaction } from '@/types';
import PageHeader, { PageHeaderActions } from '@/components/page-header';
import RefreshButton from '@/components/buttons/refresh-button';
import GenericExportButton from '@/components/buttons/generic-export-button';
import TransactionFiltersNew from '@/components/filters/transaction-filters-new';
import TransactionTableNew from '@/components/tables/transaction-table-new';
import { useTransactions } from '@/contexts/TransactionContext';

interface FilterState {
    search: string;
    status: string;
    type: string;
    offerStatus: string;
    fromDate: string;
    toDate: string;
    amountMin: string;
    amountMax: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}



interface TransactionsPageProps {
    transactions?: {
        data: Transaction[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    customers?: Array<{
        id: number;
        name: string;
        email: string;
    }>;
    filters?: Partial<FilterState>;
}

export default function Transactions({ transactions: initialTransactions = { data: [], current_page: 1, last_page: 1, per_page: 25, total: 0, from: 0, to: 0 }, filters: initialFilters = {} }: TransactionsPageProps) {
    const { t } = useTranslation();
    const { state, actions } = useTransactions();
    const [localTransactions, setLocalTransactions] = useState(initialTransactions);
    const [filters, setFilters] = useState<FilterState>({
        search: initialFilters?.search || '',
        status: initialFilters?.status || '',
        type: initialFilters?.type || '',
        offerStatus: initialFilters?.offerStatus || '',
        fromDate: initialFilters?.fromDate || '',
        toDate: initialFilters?.toDate || '',
        amountMin: initialFilters?.amountMin || '',
        amountMax: initialFilters?.amountMax || '',
        sortBy: initialFilters?.sortBy || 'transaction_date',
        sortOrder: initialFilters?.sortOrder || 'desc'
    });
    
    const mapFiltersToOptions = (currentFilters: FilterState) => ({
        search: currentFilters.search || undefined,
        status: currentFilters.status || undefined,
        type: currentFilters.type || undefined,
        offer_status: currentFilters.offerStatus || undefined,
        date_from: currentFilters.fromDate || undefined,
        date_to: currentFilters.toDate || undefined,
        amount_min: currentFilters.amountMin ? parseFloat(currentFilters.amountMin) : undefined,
        amount_max: currentFilters.amountMax ? parseFloat(currentFilters.amountMax) : undefined,
        sort_by: currentFilters.sortBy || undefined,
        sort_order: currentFilters.sortOrder || undefined,
    });

    const updateLocalFromPagination = (pagination: PaginatedResponse<Transaction> | null) => {
        setLocalTransactions((prev) => ({
            data: pagination?.data ?? [],
            current_page: pagination?.current_page ?? 1,
            last_page: pagination?.last_page ?? 1,
            per_page: pagination?.per_page ?? prev.per_page ?? 25,
            total: pagination?.total ?? (pagination?.data?.length ?? 0),
            from: pagination?.from ?? (pagination?.data?.length ? 1 : 0),
            to: pagination?.to ?? (pagination?.data?.length ?? 0),
        }));
    };

    const handleFiltersChange = (newFilters: FilterState) => {
        setFilters(newFilters);

        actions.fetchTransactions(mapFiltersToOptions(newFilters))
            .then((paginationResult) => {
                if (paginationResult) {
                    updateLocalFromPagination(paginationResult);
                }
            })
            .catch(() => {
                // Keep previous data if request fails
            });
    };

    useEffect(() => {
        if (state.pagination) {
            updateLocalFromPagination(state.pagination);
        }
    }, [state.pagination]);

    useEffect(() => {
        setLocalTransactions(initialTransactions);
    }, [initialTransactions]);

    const buildQueryFromFilters = (currentFilters: FilterState) => {
        const mapped = mapFiltersToOptions(currentFilters);
        return Object.fromEntries(
            Object.entries(mapped).filter(([, value]) => value !== undefined && value !== null && value !== '')
        );
    };

    const handleRefresh = async () => {
        try {
            // Clear any errors first
            actions.clearError();

            // Comprehensive refresh with multiple strategies for maximum reliability
            return new Promise<void>((resolve) => {
                // Strategy 1: Clear context state and trigger loading
                actions.refreshTransactions();

                // Strategy 2: Full page reload with cache busting for absolute freshness
                router.reload({
                    only: [],            // Reload everything
                    data: {
                        ...buildQueryFromFilters(filters),
                        page: localTransactions.current_page,
                        per_page: localTransactions.per_page,
                        _t: Date.now(),      // Cache busting timestamp
                        _refresh: true,      // Force refresh flag
                        _cache_clear: true   // Additional cache clearing flag
                    },
                    onBefore: () => {
                        // Clear browser cache headers
                        if ('caches' in window) {
                            caches.keys().then((names) => {
                                names.forEach(name => {
                                    caches.delete(name);
                                });
                            });
                        }
                    },
                    onSuccess: (page) => {
                        // Update all local state with completely fresh data
                        const freshTransactions = (page.props as { transactions?: PaginatedResponse<Transaction> }).transactions || initialTransactions;
                        const freshFilters = (page.props as { filters?: FilterState }).filters || {};

                        updateLocalFromPagination(freshTransactions as PaginatedResponse<Transaction>);

                        // Update filters if they changed
                        if (Object.keys(freshFilters).length > 0) {
                            setFilters(prev => ({ ...prev, ...freshFilters }));
                        }

                        resolve();
                    },
                    onError: (errors) => {
                        console.error('Comprehensive refresh failed:', errors);
                        // Fallback: Try context refresh only
                        actions.fetchTransactions(mapFiltersToOptions(filters))
                            .then((paginationResult) => {
                                if (paginationResult) {
                                    updateLocalFromPagination(paginationResult);
                                }
                            })
                            .finally(() => resolve());
                    },
                    onFinish: () => {
                        // Force a small delay to ensure all data is loaded
                        setTimeout(() => resolve(), 200);
                    }
                });
            });
        } catch {
            console.error('Refresh error');
            // Last resort: fallback refresh
            return actions.fetchTransactions(mapFiltersToOptions(filters)).then((paginationResult) => {
                if (paginationResult) {
                    updateLocalFromPagination(paginationResult);
                }
            });
        }
    };

    const handlePageChange = (page: number) => {
        // Use Inertia router to navigate to the new page
        router.get('/admin/transactions', {
            ...buildQueryFromFilters(filters),
            page: page,
            per_page: localTransactions.per_page
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    // No automatic refresh - manual only
    
    const handleViewTransaction = () => {
        // Handle view transaction - can be implemented later
    };

    const handleTransactionUpdate = (updatedTransaction: Transaction) => {
        // Update specific transaction in local state
        setLocalTransactions(prev => ({
            ...prev,
            data: prev.data.map(t =>
                t.id === updatedTransaction.id ? updatedTransaction : t
            )
        }));
    };

    const handleTransactionRemove = (transactionId: number) => {
        // Remove specific transaction from local state
        setLocalTransactions(prev => ({
            ...prev,
            data: prev.data.filter(t => t.id !== transactionId),
            total: prev.total - 1
        }));
    };
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('transactions.title'),
            href: '/admin/transactions',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('transactions.title')} - ${t('app.name')}`} />

            <div className="flex flex-1 flex-col gap-6 p-6 min-h-screen bg-white dark:bg-[#0a0a0a]">
                {/* Page Header Component */}
                <PageHeader
                    title={t('transactions.title')}
                    variant="elevated"
                    size="lg"
                    actions={
                        <PageHeaderActions>
                            <RefreshButton onRefresh={handleRefresh} />
                            <GenericExportButton 
                                data={state.transactions.length > 0 ? state.transactions : localTransactions.data}
                                filename={`transactions_export_${new Date().toISOString().split('T')[0]}.csv`}
                                headers={[
                                    t('transactions.table.orderId'),
                                    t('transactions.table.customer'),
                                    t('transactions.table.date'),
                                    t('transactions.table.amount'),
                                    t('transactions.table.status')
                                ]}
                                getRowData={(transaction) => [
                                    transaction.order_id,
                                    transaction.customer.name,
                                    new Date(transaction.transaction_date).toLocaleDateString(),
                                    transaction.grand_total.toString(),
                                    transaction.status
                                ]}
                                emptyMessage={t('export.noTransactions')}
                                successMessage={t('export.transactionsExportedSuccessfully')}
                            />
                        </PageHeaderActions>
                    }
                />

                {/* Transaction Filter Component */}
                <TransactionFiltersNew
                    onFiltersChange={handleFiltersChange}
                    initialFilters={filters}
                />

                {/* Transaction Table Component */}
                <TransactionTableNew
                    transactions={state.transactions.length > 0 ? state.transactions : localTransactions.data}
                    loading={state.loading}
                    onView={handleViewTransaction}
                    onPageChange={handlePageChange}
                    onTransactionUpdate={handleTransactionUpdate}
                    onTransactionRemove={handleTransactionRemove}
                    onFullRefresh={handleRefresh}
                    sortBy={filters.sortBy}
                    sortOrder={filters.sortOrder}
                    pagination={localTransactions}
                />
            </div>
        </AppLayout>
    );
}