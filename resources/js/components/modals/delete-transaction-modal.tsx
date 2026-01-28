import React from 'react';
import { Trash2, X, Receipt } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { Transaction } from '@/types';
import { createApiClient } from '@/utils/apiClient';

interface DeleteTransactionModalProps {
    transaction: Transaction | null;
    isOpen: boolean;
    onClose: () => void;
    onTransactionDeleted?: (transactionId: number) => void;
}

export default function DeleteTransactionModal({
    transaction,
    isOpen,
    onClose,
    onTransactionDeleted
}: DeleteTransactionModalProps) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleDelete = React.useCallback(async () => {
        if (isDeleting || !transaction) return;
        
        setIsDeleting(true);

        try {
            const apiClient = createApiClient();
            const response = await apiClient.delete(`/api/transactions/${transaction.id}`);

            const data = response.data || {};

            if (response.status === 200 && data.success) {
                toast({
                    title: t('toast.success'),
                    description: t('toast.transactionDeleted'),
                    variant: 'success',
                });
                // Call the callback first to remove from table
                onTransactionDeleted?.(transaction.id);
                // Then close the modal
                onClose();
            } else {
                const errorMessage = data.message || 'Failed to delete transaction';
                toast({
                    title: t('toast.error'),
                    description: errorMessage,
                    variant: 'destructive',
                });
            }
        } catch (error: unknown) {
            // Handle axios errors
            const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
            const status = axiosError?.response?.status;
            const data = axiosError?.response?.data;
            
            if (status === 401) {
                toast({
                    title: t('toast.error'),
                    description: data?.message || 'Unauthorized - Please log in again',
                    variant: 'destructive',
                });
            } else if (status === 403) {
                toast({
                    title: t('toast.error'),
                    description: data?.message || 'Only admins can delete transactions',
                    variant: 'destructive',
                });
            } else {
                const errorMessage = data?.message || axiosError?.message || 'Failed to delete transaction';
                toast({
                    title: t('toast.error'),
                    description: t('toast.failedToDeleteTransaction') + ': ' + errorMessage,
                    variant: 'destructive',
                });
            }
        } finally {
            setIsDeleting(false);
        }
    }, [isDeleting, transaction, onTransactionDeleted, onClose, t, toast]);

    // Handle keyboard events
    React.useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isDeleting) {
                onClose();
            } else if (e.key === 'Enter' && !isDeleting) {
                e.preventDefault();
                handleDelete();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, isDeleting, handleDelete, onClose]);

    if (!transaction || !isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg sm:rounded-xl shadow-2xl dark:shadow-black/50 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-800">
                {/* Header */}
                <div className="flex items-center p-3 sm:p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a]">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1">
                        <div className="p-1.5 sm:p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                            {t('transactions.modal.deleteTransaction.title')}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-[#262626]/50 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 overflow-y-auto max-h-[calc(95vh-200px)] sm:max-h-[calc(90vh-220px)]">
                    <div className="space-y-3 sm:space-y-4">
                        {/* Transaction Details */}
                        <div className="bg-white dark:bg-[#1a1a1a] rounded-lg p-3 border border-gray-200 dark:border-gray-800 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-[#F58E18] rounded-lg">
                                    <Receipt className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                </div>
                                <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                                    {t('transactions.modal.deleteTransaction.transactionDetails')}
                                </h3>
                            </div>
                            <div className="space-y-1 text-xs sm:text-sm">
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                    <span className="text-gray-500 dark:text-gray-400">{t('transactions.table.orderId')}:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {transaction.order_id}
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                    <span className="text-gray-500 dark:text-gray-400">{t('transactions.table.customer')}:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {transaction.customer.name}
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                    <span className="text-gray-500 dark:text-gray-400">{t('transactions.table.amount')}:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'IQD',
                                            minimumFractionDigits: 0
                                        }).format(transaction.grand_total)}
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                    <span className="text-gray-500 dark:text-gray-400">{t('transactions.table.status')}:</span>
                                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                                        {transaction.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Fixed Footer Buttons */}
                <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] p-3 sm:p-4 shadow-sm">
                    <div className="flex flex-row gap-2 sm:gap-3">
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors font-medium cursor-pointer text-xs sm:text-base touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t('common.buttons.cancel')}
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:opacity-60 text-white rounded-lg transition-colors duration-200 font-medium flex items-center justify-center gap-1 sm:gap-2 cursor-pointer disabled:cursor-not-allowed text-xs sm:text-base touch-manipulation shadow-sm hover:shadow-md disabled:shadow-sm"
                        >
                            {isDeleting ? (
                                <>
                                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                                    <span className="hidden sm:inline">{t('common.deleting')}</span>
                                    <span className="sm:hidden">{t('common.deleting')}</span>
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="hidden sm:inline">{t('transactions.modal.deleteTransaction.deleteButton')}</span>
                                    <span className="sm:hidden">{t('transactions.modal.deleteTransaction.deleteButton')}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
