import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import PageHeader, { PageHeaderActions } from '@/components/page-header';
import RefreshButton from '@/components/buttons/refresh-button';
import { formatIQDWithSymbol } from '@/lib/currency';
import { Search, AlertCircle, User, Phone, Mail, Receipt, CheckCircle } from 'lucide-react';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone?: string;
    username: string;
    role: string;
    created_at: string;
    updated_at: string;
    debt_count: number;
    total_debt: number;
}

interface PaginatedCustomers {
    data: Customer[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface DebtStats {
    total_debt_amount: number;
    total_customers_with_debt: number;
}

interface DebtsPageProps {
    customers: PaginatedCustomers;
    stats: DebtStats;
    filters: {
        search: string;
    };
}

export default function Debts({ customers: initialCustomers, stats, filters: initialFilters }: DebtsPageProps) {
    const { t } = useTranslation();

    const [customers, setCustomers] = useState<Customer[]>(initialCustomers?.data || []);
    const [pagination, setPagination] = useState({
        currentPage: initialCustomers?.current_page || 1,
        lastPage: initialCustomers?.last_page || 1,
        perPage: initialCustomers?.per_page || 25,
        total: initialCustomers?.total || 0
    });
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState(initialFilters?.search || '');

    useEffect(() => {
        setCustomers(initialCustomers?.data || []);
        setPagination({
            currentPage: initialCustomers?.current_page || 1,
            lastPage: initialCustomers?.last_page || 1,
            perPage: initialCustomers?.per_page || 25,
            total: initialCustomers?.total || 0
        });
    }, [initialCustomers]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('debts.title'),
            href: '/admin/debts',
        },
    ];

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            onFinish: () => {
                setIsRefreshing(false);
            }
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/debts', { search: searchQuery }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.get('/admin/debts', {
            search: searchQuery,
            page: page
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleViewCustomerTransactions = (customerId: number) => {
        router.get('/admin/transactions', {
            search: '',
            status: 'debt',
            customer_id: customerId
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('debts.title')} - ${t('app.name')}`} />

            <div className="flex flex-1 flex-col gap-6 p-6 min-h-screen bg-white dark:bg-[#0a0a0a]">
                {/* Page Header */}
                <PageHeader
                    title={t('debts.title')}
                    variant="elevated"
                    size="lg"
                    actions={
                        <PageHeaderActions>
                            <RefreshButton onRefresh={handleRefresh} />
                        </PageHeaderActions>
                    }
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                                    {t('debts.totalDebt')}
                                </p>
                                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                                    {formatIQDWithSymbol(stats.total_debt_amount)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                                    {t('debts.customersWithDebt')}
                                </p>
                                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                                    {stats.total_customers_with_debt}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('debts.searchPlaceholder')}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-[#F58E18] focus:border-[#F58E18]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-[#F58E18] hover:bg-[#EA580C] text-white rounded-lg font-medium transition-colors"
                    >
                        {t('common.buttons.search')}
                    </button>
                </form>

                {/* Customer Debt Table */}
                <div className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                    {isRefreshing ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F58E18]"></div>
                        </div>
                    ) : customers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                            <CheckCircle className="w-12 h-12 mb-4 text-green-500" />
                            <p className="text-lg font-medium">{t('debts.noDebts')}</p>
                            <p className="text-sm">{t('debts.noDebtsDescription')}</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-[#262626]">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('debts.customer')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('debts.contact')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('debts.debtTransactions')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('debts.totalDebtAmount')}
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('common.buttons.actions')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                        {customers.map((customer) => (
                                            <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-[#F58E18] rounded-full flex items-center justify-center">
                                                            <span className="text-white font-semibold">
                                                                {customer.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900 dark:text-white">
                                                                {customer.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                @{customer.username}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="space-y-1">
                                                        {customer.email && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                                <Mail className="w-4 h-4" />
                                                                {customer.email}
                                                            </div>
                                                        )}
                                                        {customer.phone && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                                <Phone className="w-4 h-4" />
                                                                {customer.phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                                                        <Receipt className="w-3 h-3" />
                                                        {customer.debt_count} {t('debts.transactions')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-lg font-bold text-red-600 dark:text-red-400">
                                                        {formatIQDWithSymbol(customer.total_debt)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <button
                                                        onClick={() => handleViewCustomerTransactions(customer.id)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#F58E18] hover:text-[#EA580C] hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                                                    >
                                                        <Receipt className="w-4 h-4" />
                                                        {t('debts.viewTransactions')}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-800">
                                {customers.map((customer) => (
                                    <div key={customer.id} className="p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#F58E18] rounded-full flex items-center justify-center">
                                                    <span className="text-white font-semibold">
                                                        {customer.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {customer.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        @{customer.username}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-lg font-bold text-red-600 dark:text-red-400">
                                                {formatIQDWithSymbol(customer.total_debt)}
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-sm">
                                            {customer.email && (
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                    <Mail className="w-4 h-4" />
                                                    {customer.email}
                                                </div>
                                            )}
                                            {customer.phone && (
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                    <Phone className="w-4 h-4" />
                                                    {customer.phone}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                                                <Receipt className="w-3 h-3" />
                                                {customer.debt_count} {t('debts.transactions')}
                                            </span>
                                            <button
                                                onClick={() => handleViewCustomerTransactions(customer.id)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#F58E18] hover:text-[#EA580C] rounded-lg transition-colors"
                                            >
                                                <Receipt className="w-4 h-4" />
                                                {t('debts.viewTransactions')}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination.lastPage > 1 && (
                                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t('common.pagination.showing')} {((pagination.currentPage - 1) * pagination.perPage) + 1} - {Math.min(pagination.currentPage * pagination.perPage, pagination.total)} {t('common.pagination.of')} {pagination.total}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                                            disabled={pagination.currentPage === 1}
                                            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors"
                                        >
                                            {t('common.pagination.previous')}
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                                            disabled={pagination.currentPage === pagination.lastPage}
                                            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors"
                                        >
                                            {t('common.pagination.next')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
