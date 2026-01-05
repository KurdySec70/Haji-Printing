import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Transaction, Customer, MonthlyRevenue } from '@/types';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/page-header';
import StatsCard from '@/components/stats-card';
import { 
    DollarSign, 
    Receipt, 
    Users, 
    Package, 
    CheckCircle,
    AlertTriangle,
    BarChart3,
    Clock
} from 'lucide-react';

interface DashboardStats {
    overview: {
        total_revenue: number;
        total_transactions: number;
        total_customers: number;
        total_products: number;
    };
    revenue: {
        paid_revenue: number;
        debt_revenue: number;
    };
    offers: {
        pending_offers: number;
    };
    recent_transactions: Transaction[];
    top_customers: Customer[];
    daily_revenue: MonthlyRevenue[];
}

interface AdminDashboardProps {
    stats?: DashboardStats;
    dateRange?: {
        from: string;
        to: string;
    };
}

export default function Dashboard({ stats }: AdminDashboardProps) {
    const { t } = useTranslation();
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('dashboard.title'),
            href: '/admin/dashboard',
        },
    ];

    // Default values to prevent errors
    const defaultStats: DashboardStats = {
        overview: {
            total_revenue: 0,
            total_transactions: 0,
            total_customers: 0,
            total_products: 0,
        },
        revenue: {
            paid_revenue: 0,
            debt_revenue: 0,
        },
        offers: {
            pending_offers: 0,
        },
        recent_transactions: [],
        top_customers: [],
        daily_revenue: [],
    };

    // Use provided data or defaults
    const dashboardStats = stats || defaultStats;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IQ', {
            style: 'currency',
            currency: 'IQD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (transaction: Transaction) => {
        if (transaction.type === 'offer') {
            switch (transaction.offer_status) {
                case 'pending':
                    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
                case 'accepted_paid':
                    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
                case 'accepted_debt':
                    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
                case 'rejected':
                    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
                default:
                    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
            }
        } else {
            switch (transaction.status) {
                case 'paid':
                    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
                case 'debt':
                    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
                default:
                    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
            }
        }
    };

    const getStatusIcon = (transaction: Transaction) => {
        if (transaction.type === 'offer') {
            switch (transaction.offer_status) {
                case 'pending':
                    return <Clock className="w-3 h-3" />;
                case 'accepted_paid':
                    return <CheckCircle className="w-3 h-3" />;
                case 'accepted_debt':
                    return <AlertTriangle className="w-3 h-3" />;
                case 'rejected':
                    return <AlertTriangle className="w-3 h-3" />;
                default:
                    return <Clock className="w-3 h-3" />;
            }
        } else {
            switch (transaction.status) {
                case 'paid':
                    return <CheckCircle className="w-3 h-3" />;
                case 'debt':
                    return <AlertTriangle className="w-3 h-3" />;
                default:
                    return <Clock className="w-3 h-3" />;
            }
        }
    };

    const getStatusText = (transaction: Transaction) => {
        if (transaction.type === 'offer') {
            switch (transaction.offer_status) {
                case 'pending':
                    return t('dashboard.offerStatus.pending');
                case 'accepted_paid':
                    return t('dashboard.offerStatus.acceptedPaid');
                case 'accepted_debt':
                    return t('dashboard.offerStatus.acceptedDebt');
                case 'rejected':
                    return t('dashboard.offerStatus.rejected');
                default:
                    return t('dashboard.offerStatus.unknown');
            }
        } else {
            return t(`common.status.${transaction.status}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('dashboard.title')} - ${t('app.name')}`} />
            
            <div className="flex flex-1 flex-col gap-4 sm:gap-6 lg:gap-8 p-3 sm:p-4 lg:p-6 min-h-screen bg-white dark:bg-[#0a0a0a]">
                {/* Page Header */}
                <PageHeader
                    title={t('dashboard.title')}
                    variant="elevated"
                    size="lg"
                />


                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    <StatsCard
                        title={t('dashboard.stats.totalSales')}
                        value={formatCurrency(dashboardStats.overview.total_revenue)}
                        icon={DollarSign}
                        color="orange"
                        trend={{
                            value: 12.5,
                            label: t('dashboard.vsLastPeriod'),
                            isPositive: true
                        }}
                    />
                    
                    <StatsCard
                        title={t('dashboard.stats.totalOrders')}
                        value={dashboardStats.overview.total_transactions}
                        icon={Receipt}
                        color="blue"
                        trend={{
                            value: 8.2,
                            label: t('dashboard.vsLastPeriod'),
                            isPositive: true
                        }}
                    />
                    
                    <StatsCard
                        title={t('dashboard.stats.totalCustomers')}
                        value={dashboardStats.overview.total_customers}
                        icon={Users}
                        color="purple"
                    />
                    
                    <StatsCard
                        title={t('dashboard.stats.totalProducts')}
                        value={dashboardStats.overview.total_products}
                        icon={Package}
                        color="indigo"
                    />
                </div>

                {/* Revenue Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                    <StatsCard
                        title={t('dashboard.paidRevenue')}
                        value={formatCurrency(dashboardStats.revenue.paid_revenue)}
                        icon={CheckCircle}
                        color="emerald"
                    />
                    
                    <StatsCard
                        title={t('dashboard.debtRevenue')}
                        value={formatCurrency(dashboardStats.revenue.debt_revenue)}
                        icon={AlertTriangle}
                        color="red"
                    />
                    
                    <StatsCard
                        title={t('dashboard.pendingOffers')}
                        value={dashboardStats.offers.pending_offers}
                        icon={Clock}
                        color="yellow"
                    />
                </div>


                {/* Recent Transactions */}
                {dashboardStats.recent_transactions && dashboardStats.recent_transactions.length > 0 && (
                    <div className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="bg-white dark:bg-[#1a1a1a] px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-blue-600" />
                                {t('dashboard.recentTransactions')}
                            </h2>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px]">
                                <thead className="bg-gray-50 dark:bg-[#262626]">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            {t('transactions.table.orderId')}
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            {t('transactions.table.customer')}
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            {t('transactions.table.amount')}
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            {t('transactions.table.status')}
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            {t('transactions.table.date')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-[#1a1a1a]">
                                    {dashboardStats.recent_transactions.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-[#262626]">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                {transaction.order_id}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {transaction.customer?.name || t('common.unknown')}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(transaction.grand_total)}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction)}`}>
                                                    {getStatusIcon(transaction)}
                                                    {getStatusText(transaction)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {formatDate(transaction.transaction_date)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
