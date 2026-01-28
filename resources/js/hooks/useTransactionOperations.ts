import { useCallback } from 'react';
import { useTransactions } from '@/contexts/TransactionContext';
import { createTransaction, updateTransaction, TransactionResponse } from '@/services/communication';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { TransactionData } from '@/types';

export const useTransactionOperations = () => {
    const { actions } = useTransactions();
    const { toast } = useToast();
    const { t } = useTranslation();

    const createNewTransaction = useCallback(async (transactionData: TransactionData) => {
        try {
            // Create transaction in backend
            const response = await createTransaction(transactionData);
            
            if (response) {
                // Dispatch custom event for transaction creation
                const event = new CustomEvent('transactionCreated', {
                    detail: { transaction: response }
                });
                window.dispatchEvent(event);

                return { success: true, data: response as TransactionResponse };
            }
        } catch (error) {
            toast({
                title: t('toast.error'),
                description: t('toast.transactionCreateFailed'),
                variant: 'destructive',
            });
            return { success: false, error };
        }
    }, [toast, t]);

    const refreshTransactionsList = useCallback(() => {
        actions.refreshTransactions();
    }, [actions]);

    const updateExistingTransaction = useCallback(async (transactionId: number, transactionData: TransactionData) => {
        try {
            // Update transaction in backend
            const response = await updateTransaction(transactionId, transactionData);
            
            if (response) {
                // Dispatch custom event for transaction update
                const event = new CustomEvent('transactionUpdated', {
                    detail: { transaction: response }
                });
                window.dispatchEvent(event);

                return { success: true, data: response as TransactionResponse };
            }
        } catch (error) {
            toast({
                title: t('toast.error'),
                description: t('toast.transactionUpdateFailed'),
                variant: 'destructive',
            });
            return { success: false, error };
        }
    }, [toast, t]);

    return {
        createNewTransaction,
        updateExistingTransaction,
        refreshTransactionsList,
        ...actions,
    };
};

export default useTransactionOperations;
