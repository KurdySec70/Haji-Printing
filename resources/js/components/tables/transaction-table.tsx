import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Calendar, User, CreditCard, DollarSign, Package } from 'lucide-react';
import { formatIQDWithSymbol } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Transaction {
    id: number;
    order_id: string;
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    date: string;
    amount: number;
    status: 'paid' | 'debt';
    payment_method: 'cash' | 'card' | 'other';
    items: TransactionItem[];
    notes?: string;
    created_at: string;
    updated_at: string;
}

interface TransactionItem {
    id: number;
    name: string;
    quantity: number;
    unit_price: number;
    total: number;
    type: string;
    dimensions?: string;
    weight?: string;
}

interface TransactionTableProps {
    transactions: Transaction[];
    loading?: boolean;
    onView?: (transaction: Transaction) => void;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

const TransactionTable = memo(function TransactionTable({
    transactions,
    loading = false,
    onView,
}: TransactionTableProps) {
    const { t } = useTranslation();

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            paid: {
                variant: 'default' as const,
                className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
                icon: '✓'
            },
            debt: {
                variant: 'destructive' as const,
                className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
                icon: '⚠'
            },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.debt;

        return (
            <Badge className={config.className}>
                <span className="mr-1">{config.icon}</span>
                {t(`transactions.status.${status}`)}
            </Badge>
        );
    };

    const getPaymentMethodIcon = (method: string) => {
        switch (method) {
            case 'cash':
                return <DollarSign className="w-4 h-4" />;
            case 'card':
                return <CreditCard className="w-4 h-4" />;
            default:
                return <Package className="w-4 h-4" />;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };


    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="p-6">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-500 dark:text-gray-400">{t('transactions.table.loading')}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="p-6">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <Package className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                {t('transactions.table.noTransactions')}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {t('transactions.emptyDescription')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            {/* Header */}
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {t('transactions.table.title')} ({transactions.length})
                        </h3>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {t('transactions.table.orderId')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {t('transactions.table.customer')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {t('transactions.table.date')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {t('transactions.table.amount')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {t('transactions.table.status')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {t('transactions.table.paymentMethod')}
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {t('transactions.table.actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {transactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {transaction.order_id}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {transaction.customer_name}
                                            </div>
                                            {transaction.customer_email && (
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {transaction.customer_email}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                                        <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                                        {formatDate(transaction.date)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                                        {formatIQDWithSymbol(transaction.amount)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(transaction.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                                        <span className="mr-2">
                                            {getPaymentMethodIcon(transaction.payment_method)}
                                        </span>
                                        {t(`transactions.paymentMethod.${transaction.payment_method}`)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onView?.(transaction)}
                                            className="flex items-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            {t('common.buttons.view')}
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
});

export default TransactionTable;
