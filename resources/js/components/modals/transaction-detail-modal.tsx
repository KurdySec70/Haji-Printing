import React, { useState, useEffect, useCallback } from 'react';
import { User, Receipt, Copy, Printer, Eye, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatIQDWithSymbol } from '@/lib/currency';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { generateInvoiceTemplate } from '@/utils/invoice-template';
import { transformRoute } from '@/utils/routeHelper';
import { Transaction } from '@/types';

interface TransactionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactionId?: number;
    transaction?: Transaction | null;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
    isOpen,
    onClose,
    transactionId,
    transaction: initialTransaction
}) => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [transaction, setTransaction] = useState<Transaction | null>(initialTransaction || null);
    const [loading, setLoading] = useState(false);

    const fetchTransaction = useCallback(async () => {
        if (!transactionId) return;
        
        setLoading(true);
        try {
            const response = await fetch(transformRoute(`/api/transactions/${transactionId}`));
            if (response.ok) {
                const data = await response.json();
                setTransaction(data);
            } else {
                setTransaction(null);
            }
        } catch {
            setTransaction(null);
        } finally {
            setLoading(false);
        }
    }, [transactionId]);

    useEffect(() => {
        if (isOpen && transactionId && !initialTransaction) {
            fetchTransaction();
        } else if (initialTransaction) {
            setTransaction(initialTransaction);
        }
    }, [isOpen, transactionId, initialTransaction, fetchTransaction]);

    if (!isOpen) return null;

    const handleCopyOrderId = () => {
        if (transaction?.order_id) {
            navigator.clipboard.writeText(transaction.order_id);
            toast({
                title: t('toast.success'),
                description: t('transactions.detail.copyId'),
                variant: 'success',
            });
        }
    };


    const handlePrint = async () => {
        if (!transaction) return;
        
        try {
            // Fetch settings first
            const response = await fetch('/admin/api/invoice-settings');
            const data = await response.json();
            const settings = data.settings || {};
            
            const printContent = generateInvoiceTemplate(transaction, settings);
        
        // Create a hidden iframe for printing
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.left = '-9999px';
        iframe.style.top = '-9999px';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        
        document.body.appendChild(iframe);
        
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        
        if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(printContent);
            iframeDoc.close();
            
            // Wait for content to load then print
            iframe.onload = () => {
                setTimeout(() => {
                    iframe.contentWindow?.print();
                    
                    // Clean up the iframe after printing
                    setTimeout(() => {
                        document.body.removeChild(iframe);
                    }, 1000);
                }, 100);
            };
        }
        } catch (error) {
            console.error('Error fetching settings for print:', error);
            // Fallback to default settings
            const printContent = generateInvoiceTemplate(transaction);
            
            // Create a hidden iframe for printing
            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.left = '-9999px';
            iframe.style.top = '-9999px';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = 'none';
            
            document.body.appendChild(iframe);
            
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            
            if (iframeDoc) {
                iframeDoc.open();
                iframeDoc.write(printContent);
                iframeDoc.close();
                
                // Wait for content to load then print
                iframe.onload = () => {
                    setTimeout(() => {
                        iframe.contentWindow?.print();
                        
                        // Clean up the iframe after printing
                        setTimeout(() => {
                            document.body.removeChild(iframe);
                        }, 1000);
                    }, 100);
                };
            }
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid':
                return <CheckCircle className="w-4 h-4 text-emerald-600" />;
            case 'debt':
                return <AlertTriangle className="w-4 h-4 text-red-600" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-600" />;
            default:
                return <Clock className="w-4 h-4 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
            case 'debt':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                
                {/* Modal */}
                <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-3 text-gray-600 dark:text-gray-400">
                            {t('transactions.detail.loading')}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    if (!transaction) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                
                {/* Modal */}
                <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">
                                {t('transactions.detail.notFound')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <Receipt className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t('transactions.detail.title')}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopyOrderId}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                            title={t('transactions.detail.copyId')}
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handlePrint}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                            title={t('transactions.detail.print')}
                        >
                            <Printer className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Left Column - Transaction Info */}
                        <div className="lg:col-span-1 space-y-3">
                            {/* Transaction Header */}
                            <div className="bg-gray-50 dark:bg-[#262626]/50 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <Receipt className="w-4 h-4 text-indigo-600" />
                                    <h3 className="font-medium text-gray-900 dark:text-white">{t('transactions.detail.orderId')}</h3>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">{t('transactions.detail.orderId')}:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {transaction.order_id}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">{t('transactions.detail.status')}:</span>
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                            {getStatusIcon(transaction.status)}
                                            {t(`transactions.status.${transaction.status}`)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">{t('transactions.detail.date')}:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {formatDate(transaction.transaction_date)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div className="bg-gray-50 dark:bg-[#262626]/50 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4 text-indigo-600" />
                                    <h3 className="font-medium text-gray-900 dark:text-white">{t('transactions.detail.customerInfo')}</h3>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">{t('common.labels.name')}:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {transaction.customer.name}
                                        </span>
                                    </div>
                                    {transaction.customer.email && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">{t('common.labels.email')}:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {transaction.customer.email}
                                            </span>
                                        </div>
                                    )}
                                    {transaction.customer.phone && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">{t('common.labels.phone')}:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {transaction.customer.phone}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Processed By (Cashier Information) */}
                            <div className="bg-gray-50 dark:bg-[#262626]/50 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4 text-indigo-600" />
                                    <h3 className="font-medium text-gray-900 dark:text-white">{t('transactions.detail.processedBy')}</h3>
                                </div>
                                <div className="space-y-1 text-sm">
                                    {transaction.cashier ? (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500 dark:text-gray-400">{t('transactions.detail.cashierName')}:</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {transaction.cashier.name}
                                                </span>
                                            </div>
                                            {transaction.cashier.email && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500 dark:text-gray-400">{t('common.labels.email')}:</span>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {transaction.cashier.email}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span className="text-gray-500 dark:text-gray-400">{t('transactions.detail.role')}:</span>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    transaction.cashier.role === 'admin' 
                                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                }`}>
                                                    {transaction.cashier.role === 'admin' ? 'Admin' : 'Cashier'}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {t('transactions.detail.noCashierInfo')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Order Items & Summary */}
                        <div className="lg:col-span-2 space-y-3">
                            {/* Order Items Header */}
                            <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4 text-indigo-600" />
                                <h3 className="font-medium text-gray-900 dark:text-white">{t('transactions.detail.orderItems')}</h3>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    ({transaction.items?.length || 0} {(transaction.items?.length || 0) === 1 ? t('pos.checkout.item') : t('pos.checkout.items')})
                                </span>
                            </div>

                            {/* Items Table */}
                            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-white dark:bg-[#1a1a1a] sticky top-0 z-10">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    {t('pos.checkout.product')}
                                                </th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    {t('transactions.detail.type')}
                                                </th>
                                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    {t('transactions.detail.quantity')}
                                                </th>
                                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    {t('transactions.detail.unitPrice')}
                                                </th>
                                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    {t('pos.checkout.total')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {(transaction.items?.length || 0) === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-3 py-8 text-center text-gray-500 dark:text-gray-400">
                                                        {t('transactions.detail.noItems')}
                                                    </td>
                                                </tr>
                                            ) : (
                                                transaction.items?.map((item, index) => (
                                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                        <td className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white">
                                                            {item.name}
                                                        </td>
                                                        <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                                            <div className="space-y-1">
                                                                <div>{item.type}</div>
                                                                {item.dimensions && (
                                                                    <div className="text-xs text-gray-400">
                                                                        {t('transactions.detail.dimensions')}: {item.dimensions}
                                                                    </div>
                                                                )}
                                                                {item.weight && (
                                                                    <div className="text-xs text-gray-400">
                                                                        {t('transactions.detail.weight')}: {item.weight}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-2 text-sm text-gray-900 dark:text-white text-right">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="px-3 py-2 text-sm text-gray-900 dark:text-white text-right">
                                                            {formatIQDWithSymbol(item.unit_price)}
                                                        </td>
                                                        <td className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white text-right">
                                                            {formatIQDWithSymbol(item.total)}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Financial Summary */}
                            <div className={`rounded-lg p-3 border ${
                                transaction.status === 'paid'
                                    ? 'bg-white dark:bg-[#1a1a1a] border-[#10b981] dark:border-[#10b981]'
                                    : transaction.status === 'debt'
                                    ? 'bg-white dark:bg-[#1a1a1a] border-[#ef4444] dark:border-[#ef4444]'
                                    : 'bg-white dark:bg-[#1a1a1a] border-[#f59e0b] dark:border-[#f59e0b]'
                            }`}>
                                <div className="space-y-2">
                                    {/* Subtotal */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-300">{t('transactions.detail.subtotal')}:</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatIQDWithSymbol(transaction.subtotal)}
                                        </span>
                                    </div>
                                    
                                    {/* Discount */}
                                    {transaction.discount_amount > 0 && (
                                        <div className="flex justify-between items-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800">
                                            <span className="text-sm font-semibold text-red-700 dark:text-red-300">{t('transactions.detail.discount')}:</span>
                                            <span className="text-lg font-bold text-red-700 dark:text-red-300">
                                                -{formatIQDWithSymbol(transaction.discount_amount)}
                                            </span>
                                        </div>
                                    )}
                                    
                                    {/* Grand Total */}
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-800">
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{t('transactions.detail.grandTotal')}</h4>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm text-gray-600 dark:text-gray-300">{t('transactions.detail.finalAmount')}</p>
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                                    {getStatusIcon(transaction.status)}
                                                    {t(`transactions.status.${transaction.status}`)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-2xl font-bold ${
                                                transaction.status === 'paid'
                                                    ? 'text-emerald-600 dark:text-emerald-400'
                                                    : transaction.status === 'debt'
                                                    ? 'text-red-600 dark:text-red-400'
                                                    : 'text-yellow-600 dark:text-yellow-400'
                                            }`}>
                                                {formatIQDWithSymbol(transaction.grand_total)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Fixed Footer */}
                <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] p-4 flex-shrink-0">
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#262626]/50 transition-colors font-medium cursor-pointer"
                        >
                            {t('common.buttons.close')}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};


export default TransactionDetailModal;
