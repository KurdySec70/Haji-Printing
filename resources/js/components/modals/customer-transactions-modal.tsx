import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Receipt, X, User, Calendar, DollarSign, CreditCard, AlertCircle, CheckCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RefreshCw, Clock, Printer, Download, Edit, Trash2, Search, RotateCcw, Filter, ArrowUpDown, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import DeleteTransactionModal from './delete-transaction-modal';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { formatIQDWithSymbol } from '@/lib/currency';
import { transformRoute } from '@/utils/routeHelper';
import { generateInvoiceTemplate, type InvoiceSettings } from '@/utils/invoice-template';
import type { Transaction } from '@/types';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone?: string;
    username: string;
    role: string;
    created_at: string;
    updated_at: string;
}


interface CustomerTransactionsModalProps {
    customer: Customer | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function CustomerTransactionsModal({
    customer,
    isOpen,
    onClose
}: CustomerTransactionsModalProps) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTransactionCount, setTotalTransactionCount] = useState(0);
    const [perPage] = useState(10);
    const [printingTransactionId, setPrintingTransactionId] = useState<number | null>(null);
    const [printingDebtSummary, setPrintingDebtSummary] = useState(false);
    const [printingPaidSummary, setPrintingPaidSummary] = useState(false);
    const [exportingTransactions, setExportingTransactions] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

    // Search, filter, and sort states
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'debt'>('all');
    const [typeFilter, setTypeFilter] = useState<'all' | 'transaction' | 'offer'>('all');
    const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    
    // Custom dropdown states
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const [isSortByDropdownOpen, setIsSortByDropdownOpen] = useState(false);
    const [isSortOrderDropdownOpen, setIsSortOrderDropdownOpen] = useState(false);
    
    // Refs for dropdown click outside detection
    const statusDropdownRef = useRef<HTMLDivElement>(null);
    const typeDropdownRef = useRef<HTMLDivElement>(null);
    const sortByDropdownRef = useRef<HTMLDivElement>(null);
    const sortOrderDropdownRef = useRef<HTMLDivElement>(null);

    // Option arrays for dropdowns (memoized to avoid recreation on every render)
    const statusOptions = useMemo(() => [
        { value: 'all', label: t('customers.modal.transactions.filters.all', { defaultValue: 'All Status' }) },
        { value: 'paid', label: t('customers.modal.transactions.filters.paid', { defaultValue: 'Paid' }) },
        { value: 'debt', label: t('customers.modal.transactions.filters.debt', { defaultValue: 'Debt' }) },
    ], [t]);

    const typeOptions = useMemo(() => [
        { value: 'all', label: t('customers.modal.transactions.filters.allTypes', { defaultValue: 'All Types' }) },
        { value: 'transaction', label: t('customers.modal.transactions.filters.transaction', { defaultValue: 'Transaction' }) },
        { value: 'offer', label: t('customers.modal.transactions.filters.offer', { defaultValue: 'Offer' }) },
    ], [t]);

    const sortByOptions = useMemo(() => [
        { value: 'date', label: t('customers.modal.transactions.sort.date', { defaultValue: 'Date' }) },
        { value: 'amount', label: t('customers.modal.transactions.sort.amount', { defaultValue: 'Amount' }) },
    ], [t]);

    const sortOrderOptions = useMemo(() => [
        { value: 'desc', label: t('customers.modal.transactions.sort.descending', { defaultValue: 'Descending' }) },
        { value: 'asc', label: t('customers.modal.transactions.sort.ascending', { defaultValue: 'Ascending' }) },
    ], [t]);

    // Click outside detection for dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
                setIsStatusDropdownOpen(false);
            }
            if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
                setIsTypeDropdownOpen(false);
            }
            if (sortByDropdownRef.current && !sortByDropdownRef.current.contains(event.target as Node)) {
                setIsSortByDropdownOpen(false);
            }
            if (sortOrderDropdownRef.current && !sortOrderDropdownRef.current.contains(event.target as Node)) {
                setIsSortOrderDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchCustomerTransactions = useCallback(async () => {
        if (!customer) return;

        setLoading(true);
        try {
            // Build query params
            const params = new URLSearchParams({
                customer_id: customer.id.toString(),
                per_page: perPage.toString(),
                page: currentPage.toString(),
                sort_by: sortBy === 'date' ? 'transaction_date' : 'grand_total',
                sort_order: sortOrder,
            });

            // Add search if provided
            if (searchQuery.trim()) {
                params.append('search', searchQuery.trim());
            }

            // Add status filter
            if (statusFilter !== 'all') {
                params.append('status', statusFilter);
            }

            // Add type filter
            if (typeFilter !== 'all') {
                params.append('type', typeFilter);
            }

            const response = await fetch(transformRoute(`/api/transactions?${params.toString()}`), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.transactions && data.transactions.data) {
                setTransactions(data.transactions.data);
                setTotalPages(data.transactions.last_page || 1);
                setTotalTransactionCount(data.transactions.total || 0);
            } else {
                setTransactions([]);
                setTotalPages(1);
                setTotalTransactionCount(0);
            }
        } catch {
            toast({
                title: t('toast.error'),
                description: t('toast.failedToLoadTransactions'),
                variant: "destructive",
            });
            setTransactions([]);
            setTotalPages(1);
            setTotalTransactionCount(0);
        } finally {
            setLoading(false);
        }
    }, [customer, currentPage, perPage, searchQuery, statusFilter, typeFilter, sortBy, sortOrder, toast, t]);

    const fetchInvoiceSettings = useCallback(async (): Promise<InvoiceSettings | undefined> => {
        try {
            const response = await fetch(transformRoute('/admin/api/invoice-settings'), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                return undefined;
            }

            const data = await response.json();
            return (data.settings ?? undefined) as InvoiceSettings | undefined;
        } catch {
            return undefined;
        }
    }, []);

    const printHtmlDocument = useCallback((html: string) => {
        return new Promise<void>((resolve, reject) => {
            const iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = '0';
            iframe.style.bottom = '0';
            iframe.style.right = '0';

            let hasTriggeredPrint = false;

            const cleanup = () => {
                iframe.removeEventListener('load', handleLoad);
                iframe.removeEventListener('error', handleErrorEvent);
                if (iframe.parentNode) {
                    iframe.parentNode.removeChild(iframe);
                }
            };

            const handleError = (error?: Error) => {
                cleanup();
                reject(error ?? new Error('Failed to prepare print document'));
            };

            const handleLoad = () => {
                // Guard against multiple load events (about:blank + srcdoc)
                if (hasTriggeredPrint) {
                    return;
                }

                const iframeWindow = iframe.contentWindow;
                const iframeDocument = iframe.contentDocument;

                if (!iframeWindow || !iframeDocument || !iframeDocument.body) {
                    return;
                }

                if (!iframeDocument.body.childNodes.length) {
                    return;
                }

                hasTriggeredPrint = true;

                try {
                    setTimeout(() => {
                        try {
                            iframeWindow.focus();
                            iframeWindow.print();
                        } catch (error) {
                            hasTriggeredPrint = false;
                            handleError(error instanceof Error ? error : new Error('Print dialog failed'));
                            return;
                        }

                        setTimeout(() => {
                            cleanup();
                            resolve();
                        }, 300);
                    }, 100);
                } catch (error) {
                    hasTriggeredPrint = false;
                    handleError(error instanceof Error ? error : new Error('Print preparation failed'));
                }
            };

            const handleErrorEvent = () => {
                handleError(new Error('Unable to load print frame'));
            };

            iframe.addEventListener('load', handleLoad);
            iframe.addEventListener('error', handleErrorEvent);

            document.body.appendChild(iframe);

            try {
                iframe.srcdoc = html;
            } catch {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                if (!iframeDoc) {
                    handleError(new Error('Unable to access print document context'));
                    return;
                }

                iframeDoc.open();
                iframeDoc.write(html);
                iframeDoc.close();
            }
        });
    }, []);

    const fetchAllDebtTransactions = useCallback(async () => {
        if (!customer) {
            return [] as Transaction[];
        }

        const perPageLimit = 100;
        let page = 1;
        let hasMore = true;
        const results: Transaction[] = [];

        while (hasMore) {
            try {
                const response = await fetch(transformRoute(`/api/transactions?customer_id=${customer.id}&status=debt&per_page=${perPageLimit}&page=${page}`), {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const pageTransactions: Transaction[] = data?.transactions?.data ?? [];
                results.push(...pageTransactions);

                const lastPage = data?.transactions?.last_page ?? page;
                hasMore = page < lastPage;
                page += 1;
            } catch (error) {
                throw error instanceof Error ? error : new Error('Failed to load debt transactions');
            }
        }

        return results;
    }, [customer]);

    const fetchAllPaidTransactions = useCallback(async () => {
        if (!customer) {
            return [] as Transaction[];
        }

        const perPageLimit = 100;
        let page = 1;
        let hasMore = true;
        const results: Transaction[] = [];

        while (hasMore) {
            try {
                const response = await fetch(transformRoute(`/api/transactions?customer_id=${customer.id}&status=paid&per_page=${perPageLimit}&page=${page}`), {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const pageTransactions: Transaction[] = data?.transactions?.data ?? [];
                results.push(...pageTransactions);

                const lastPage = data?.transactions?.last_page ?? page;
                hasMore = page < lastPage;
                page += 1;
            } catch (error) {
                throw error instanceof Error ? error : new Error('Failed to load paid transactions');
            }
        }

        return results;
    }, [customer]);

    const fetchAllTransactions = useCallback(async () => {
        if (!customer) {
            return [] as Transaction[];
        }

        const perPageLimit = 100;
        let page = 1;
        let hasMore = true;
        const results: Transaction[] = [];

        while (hasMore) {
            try {
                const response = await fetch(transformRoute(`/api/transactions?customer_id=${customer.id}&per_page=${perPageLimit}&page=${page}`), {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const pageTransactions: Transaction[] = data?.transactions?.data ?? [];
                results.push(...pageTransactions);

                const lastPage = data?.transactions?.last_page ?? page;
                hasMore = page < lastPage;
                page += 1;
            } catch (error) {
                throw error instanceof Error ? error : new Error('Failed to load transactions');
            }
        }

        return results;
    }, [customer]);

    const handlePrintDebtSummary = useCallback(async () => {
        if (!customer) {
            return;
        }

        setPrintingDebtSummary(true);

        try {
            const [settings, debtTransactions] = await Promise.all([
                fetchInvoiceSettings(),
                fetchAllDebtTransactions(),
            ]);

            if (!debtTransactions.length) {
                toast({
                    title: t('toast.info'),
                    description: t('customers.modal.transactions.noDebtTransactions', {
                        defaultValue: 'No debt transactions available for this customer.',
                    }),
                    variant: 'default',
                });
                setPrintingDebtSummary(false);
                return;
            }

            const totalDebtAmount = debtTransactions.reduce((sum, transaction) => {
                const amount = Number(transaction.grand_total ?? 0);
                return sum + amount;
            }, 0);

            const printContent = generateDebtSummaryTemplate(customer, debtTransactions, totalDebtAmount, settings ?? {});

            await printHtmlDocument(printContent);
            setPrintingDebtSummary(false);
        } catch {
            setPrintingDebtSummary(false);
            toast({
                title: t('toast.error'),
                description: t('customers.modal.transactions.printDebtSummaryError', {
                    defaultValue: 'Failed to generate debt summary. Please try again.',
                }),
                variant: 'destructive',
            });
        }
    }, [customer, fetchAllDebtTransactions, fetchInvoiceSettings, printHtmlDocument, toast, t]);

    const handlePrintPaidSummary = useCallback(async () => {
        if (!customer) {
            return;
        }

        setPrintingPaidSummary(true);

        try {
            const [settings, paidTransactions] = await Promise.all([
                fetchInvoiceSettings(),
                fetchAllPaidTransactions(),
            ]);

            if (!paidTransactions.length) {
                toast({
                    title: t('toast.info'),
                    description: t('customers.modal.transactions.noPaidTransactions', {
                        defaultValue: 'No paid transactions available for this customer.',
                    }),
                    variant: 'default',
                });
                setPrintingPaidSummary(false);
                return;
            }

            const totalPaidAmount = paidTransactions.reduce((sum, transaction) => {
                const amount = Number(transaction.grand_total ?? 0);
                return sum + amount;
            }, 0);

            const printContent = generatePaidSummaryTemplate(customer, paidTransactions, totalPaidAmount, settings ?? {});

            await printHtmlDocument(printContent);
            setPrintingPaidSummary(false);
        } catch {
            setPrintingPaidSummary(false);
            toast({
                title: t('toast.error'),
                description: t('customers.modal.transactions.printPaidSummaryError', {
                    defaultValue: 'Failed to generate paid summary. Please try again.',
                }),
                variant: 'destructive',
            });
        }
    }, [customer, fetchAllPaidTransactions, fetchInvoiceSettings, printHtmlDocument, toast, t]);

    const handleExportAllTransactions = useCallback(async () => {
        if (!customer) {
            return;
        }

        setExportingTransactions(true);

        try {
            const allTransactions = await fetchAllTransactions();

            if (!allTransactions.length) {
                toast({
                    title: t('toast.info'),
                    description: t('customers.modal.transactions.noTransactionsToExport', {
                        defaultValue: 'No transactions available to export.',
                    }),
                    variant: 'default',
                });
                setExportingTransactions(false);
                return;
            }

            // Calculate totals
            const paidTransactions = allTransactions.filter(t => t.status === 'paid');
            const debtTransactions = allTransactions.filter(t => t.status === 'debt');
            
            const totalPaidAmount = paidTransactions.reduce((sum, t) => sum + parseFloat(t.grand_total.toString()), 0);
            const totalDebtAmount = debtTransactions.reduce((sum, t) => sum + parseFloat(t.grand_total.toString()), 0);
            const grandTotal = totalPaidAmount + totalDebtAmount;

            // Create CSV content
            const headers = [
                'Order ID',
                'Transaction Date',
                'Status',
                'Amount (IQD)',
                'Notes'
            ];

            const escapeCSV = (value: string | number | null | undefined): string => {
                if (value === null || value === undefined) {
                    return '';
                }
                const str = String(value);
                if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                    return `"${str.replace(/"/g, '""')}"`;
                }
                return str;
            };

            let csvContent = headers.join(',') + '\n';

            // Add transaction rows
            allTransactions.forEach(transaction => {
                const date = transaction.transaction_date ? new Date(transaction.transaction_date).toLocaleString() : '';
                csvContent += [
                    escapeCSV(transaction.order_id),
                    escapeCSV(date),
                    escapeCSV(transaction.status.toUpperCase()),
                    escapeCSV(transaction.grand_total.toString()),
                    escapeCSV(transaction.notes || '')
                ].join(',') + '\n';
            });

            // Add empty row
            csvContent += '\n';

            // Add totals section
            csvContent += 'SUMMARY,\n';
            csvContent += `Total Transactions,${allTransactions.length}\n`;
            csvContent += `Paid Transactions,${paidTransactions.length}\n`;
            csvContent += `Debt Transactions,${debtTransactions.length}\n`;
            csvContent += `Total Paid Amount (IQD),${totalPaidAmount.toFixed(2)}\n`;
            csvContent += `Total Debt Amount (IQD),${totalDebtAmount.toFixed(2)}\n`;
            csvContent += `Grand Total (IQD),${grandTotal.toFixed(2)}\n`;

            // Download CSV
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            const filename = `customer_${customer.id}_transactions_${new Date().toISOString().split('T')[0]}.csv`;
            
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast({
                title: t('toast.success'),
                description: t('customers.modal.transactions.exportSuccess', {
                    defaultValue: 'Transactions exported successfully.',
                }),
                variant: 'success',
            });

            setExportingTransactions(false);
        } catch {
            setExportingTransactions(false);
            toast({
                title: t('toast.error'),
                description: t('customers.modal.transactions.exportError', {
                    defaultValue: 'Failed to export transactions. Please try again.',
                }),
                variant: 'destructive',
            });
        }
    }, [customer, fetchAllTransactions, toast, t]);

    // Fetch transactions when modal opens or page changes
    useEffect(() => {
        if (isOpen && customer) {
            fetchCustomerTransactions();
        }
    }, [isOpen, customer, currentPage, fetchCustomerTransactions]);

    // Pagination functions
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleRefresh = () => {
        fetchCustomerTransactions();
    };

    const handlePrintTransaction = async (transaction: Transaction) => {
        setPrintingTransactionId(transaction.id);

        try {
            const settings = await fetchInvoiceSettings();

            const normalizedTransaction: Transaction = {
                id: transaction.id,
                order_id: transaction.order_id,
                customer_id: transaction.customer_id,
                cashier_id: undefined,
                customer: {
                    id: transaction.customer.id,
                    name: transaction.customer.name,
                    email: transaction.customer.email,
                    phone: transaction.customer.phone,
                    username: undefined,
                    role: undefined,
                    created_at: transaction.customer.created_at ?? transaction.created_at,
                    updated_at: transaction.customer.updated_at ?? transaction.updated_at,
                },
                cashier: undefined,
                items: transaction.items.map((item, index) => ({
                    id: item.id ?? index + 1,
                    name: item.name,
                    quantity: item.quantity,
                    unit_price: item.unit_price ?? 0,
                    total: item.total,
                    type: item.type ?? 'pcs',
                    dimensions: item.dimensions,
                    weight: item.weight,
                    discount: item.discount,
                })),
                subtotal: transaction.subtotal,
                discount_amount: transaction.discount_amount,
                grand_total: transaction.grand_total,
                transaction_date: transaction.transaction_date,
                status: transaction.status === 'paid' ? 'paid' : 'debt',
                type: transaction.type,
                offer_status: undefined,
                notes: transaction.notes,
                created_at: transaction.created_at,
                updated_at: transaction.updated_at,
            };

            const printContent = generateInvoiceTemplate(normalizedTransaction, settings);
            await printHtmlDocument(printContent);
            setPrintingTransactionId(null);
        } catch {
            setPrintingTransactionId(null);
            toast({
                title: t('toast.error'),
                description: t('customers.modal.transactions.printError', {
                    defaultValue: 'Failed to open print dialog. Please try again.',
                }),
                variant: 'destructive',
            });
        }
    };

    if (!customer || !isOpen) return null;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'debt':
                return <AlertCircle className="w-4 h-4 text-red-600" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-600" />;
            default:
                return <Clock className="w-4 h-4 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
            case 'debt':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'paid':
                return t('transactions.status.paid');
            case 'debt':
                return t('transactions.status.debt');
            case 'pending':
                return t('transactions.status.pending');
            default:
                return status;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const handlePayDebt = async (transaction: Transaction) => {
        try {
            const response = await fetch(transformRoute(`/api/transactions/${transaction.id}`), {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    // No CSRF token needed
                },
                body: JSON.stringify({
                    status: 'paid'
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                toast({
                    title: t('toast.success'),
                    description: t('toast.transactionPaid'),
                    variant: 'success',
                });
                
                // Refresh transactions data
                fetchCustomerTransactions();
            } else {
                throw new Error(data.message || 'Failed to update transaction');
            }
        } catch {
            toast({
                title: t('toast.error'),
                description: t('toast.failedToPayDebt'),
                variant: "destructive",
            });
        }
    };

    const handleEditTransaction = (transaction: Transaction) => {
        // Navigate to POS page with transaction ID for editing
        router.visit(`/admin/point-of-sale?edit=${transaction.id}`);
    };

    const handleDeleteTransaction = (transaction: Transaction) => {
        setTransactionToDelete(transaction);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setTransactionToDelete(null);
    };

    const handleTransactionDeleted = (transactionId: number) => {
        // Remove the deleted transaction from local state
        setTransactions(prev => prev.filter(t => t.id !== transactionId));
        setTotalTransactionCount(prev => prev - 1);
        handleCloseDeleteModal();
        // Refresh to get accurate data
        fetchCustomerTransactions();
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setTypeFilter('all');
        setSortBy('date');
        setSortOrder('desc');
        setCurrentPage(1);
        setIsStatusDropdownOpen(false);
        setIsTypeDropdownOpen(false);
        setIsSortByDropdownOpen(false);
        setIsSortOrderDropdownOpen(false);
    };

    const hasActiveFilters = searchQuery.trim() !== '' || statusFilter !== 'all' || typeFilter !== 'all' || sortBy !== 'date' || sortOrder !== 'desc';

    // Calculate totals
    const totalTransactions = totalTransactionCount;
    const paidTransactions = transactions.filter(t => t.status === 'paid').length;
    const debtTransactions = transactions.filter(t => t.status === 'debt').length;
    
    const totalPaidAmount = transactions
        .filter(t => t.status === 'paid')
        .reduce((sum, t) => sum + parseFloat(t.grand_total.toString()), 0);
    
    const totalDebtAmount = transactions
        .filter(t => t.status === 'debt')
        .reduce((sum, t) => sum + parseFloat(t.grand_total.toString()), 0);

    const printLabel = t('transactions.detail.print');

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 max-w-7xl w-full mx-2 sm:mx-4 max-h-[95vh] overflow-hidden">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a]">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#F58E18] rounded-lg flex items-center justify-center shadow-sm">
                            <Receipt className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate">
                                {t('customers.modal.transactions.title')}
                            </h2>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium truncate">
                                    {customer.name}
                                </p>
                                <span className="hidden sm:inline text-gray-400">•</span>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 truncate">
                                    {customer.email}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        {/* Export Button - Purple */}
                        <button
                            onClick={handleExportAllTransactions}
                            disabled={exportingTransactions || loading}
                            title={t('customers.modal.transactions.exportAll', { defaultValue: 'Export all transactions to CSV' })}
                            className="flex items-center justify-center h-9 px-3.5 rounded-lg bg-[#8b5cf6] hover:bg-[#7c3aed] text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                            aria-label={t('customers.modal.transactions.exportAll', { defaultValue: 'Export all transactions to CSV' })}
                        >
                            {exportingTransactions ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <Download className="w-4 h-4" />
                            )}
                        </button>

                        {/* Paid Summary Button - Green */}
                        <button
                            onClick={handlePrintPaidSummary}
                            disabled={printingPaidSummary || loading}
                            title={t('customers.modal.transactions.printPaidSummary', { defaultValue: 'Print paid summary' })}
                            className="flex items-center justify-center h-9 px-3.5 rounded-lg bg-[#10b981] hover:bg-[#059669] text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                            aria-label={t('customers.modal.transactions.printPaidSummary', { defaultValue: 'Print paid summary' })}
                        >
                            {printingPaidSummary ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <Printer className="w-4 h-4" />
                            )}
                        </button>

                        {/* Debt Summary Button - Blue */}
                        <button
                            onClick={handlePrintDebtSummary}
                            disabled={printingDebtSummary || loading}
                            title={t('customers.modal.transactions.printDebtSummary', { defaultValue: 'Print debt summary' })}
                            className="flex items-center justify-center h-9 px-3.5 rounded-lg bg-[#3b82f6] hover:bg-[#2563EB] text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                            aria-label={t('customers.modal.transactions.printDebtSummary', { defaultValue: 'Print debt summary' })}
                        >
                            {printingDebtSummary ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <Printer className="w-4 h-4" />
                            )}
                        </button>

                        {/* Refresh Button - Gray */}
                        <button
                            onClick={handleRefresh}
                            disabled={loading}
                            title={t('common.refresh', { defaultValue: 'Refresh' })}
                            className="flex items-center justify-center h-9 px-3.5 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>

                        {/* Close Button - Red */}
                        <button
                            onClick={onClose}
                            className="flex items-center justify-center h-9 w-9 rounded-lg bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors duration-200"
                        >
                            <X className="w-4.5 h-4.5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6 max-h-[calc(95vh-180px)] overflow-y-auto">
                    {/* Customer Info */}
                    <div className="p-3 sm:p-4 bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-3 sm:mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                                <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                                    {customer.name}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    Customer ID: #{customer.id}
                                </p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                                <span className="text-gray-600 dark:text-gray-400 font-medium">Email:</span>
                                <span className="font-semibold text-gray-900 dark:text-white truncate">
                                    {customer.email}
                                </span>
                            </div>
                            {customer.phone && (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">Phone:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {customer.phone}
                                    </span>
                                </div>
                            )}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                                <span className="text-gray-600 dark:text-gray-400 font-medium">Username:</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {customer.username}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                                <span className="text-gray-600 dark:text-gray-400 font-medium">Member Since:</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {formatDate(customer.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        <div className="p-3 sm:p-4 bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
                            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <Receipt className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xs sm:text-sm font-semibold text-blue-800 dark:text-blue-300">
                                    {t('customers.modal.transactions.totalTransactions')}
                                </span>
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100">
                                {totalTransactions}
                            </p>
                        </div>
                        
                        <div className="p-3 sm:p-4 bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
                            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xs sm:text-sm font-semibold text-green-800 dark:text-green-300">
                                    {t('customers.modal.transactions.paidTransactions')}
                                </span>
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-green-900 dark:text-green-100">
                                {paidTransactions}
                            </p>
                            <p className="text-xs sm:text-sm text-green-700 dark:text-green-400 font-medium">
                                {formatIQDWithSymbol(totalPaidAmount)}
                            </p>
                        </div>
                        
                        <div className="p-3 sm:p-4 bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                                    <AlertCircle className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xs sm:text-sm font-semibold text-red-800 dark:text-red-300">
                                    {t('customers.modal.transactions.debtTransactions')}
                                </span>
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-red-900 dark:text-red-100">
                                {debtTransactions}
                            </p>
                            <p className="text-xs sm:text-sm text-red-700 dark:text-red-400 font-medium">
                                {formatIQDWithSymbol(totalDebtAmount)}
                            </p>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-white dark:bg-[#1a1a1a] px-3 sm:px-4 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                                    {t('customers.modal.transactions.transactionHistory')}
                                </h3>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    <span>{t('customers.modal.transactions.showing')} {((currentPage - 1) * perPage) + 1} - {Math.min(currentPage * perPage, totalTransactionCount)} {t('customers.modal.transactions.of')} {totalTransactionCount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Search, Filter, and Sort Controls - Compact Inline Design */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-[#262626] dark:to-[#1f1f1f] px-3 sm:px-4 py-3 border-b border-gray-200/50 dark:border-gray-800/50">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
                                {/* Search Input - Takes remaining space */}
                                <div className="relative flex-1 min-w-0">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 z-10" />
                                    <input
                                        type="text"
                                        placeholder={t('customers.modal.transactions.searchPlaceholder', { defaultValue: 'Search by order ID or notes...' })}
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-200"
                                    />
                                </div>

                                {/* Filters and Sorts - Compact Custom Design */}
                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                    {/* Status Filter - Custom Dropdown */}
                                    <div className="relative" ref={statusDropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-200 cursor-pointer min-w-[120px] sm:min-w-[140px]"
                                        >
                                            <Filter className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                                            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 flex-1 text-left">
                                                {statusOptions.find(opt => opt.value === statusFilter)?.label || statusOptions[0].label}
                                            </span>
                                            <ChevronDown className={`w-3 h-3 text-gray-400 dark:text-gray-500 transition-transform duration-200 flex-shrink-0 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        
                                        {isStatusDropdownOpen && (
                                            <div className="absolute top-full left-0 mt-1.5 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-lg z-50 overflow-hidden min-w-full">
                                                {statusOptions.map((option) => (
                                                    <button
                                                        key={option.value}
                                                        type="button"
                                                        onClick={() => {
                                                            setStatusFilter(option.value as 'all' | 'paid' | 'debt');
                                                            setCurrentPage(1);
                                                            setIsStatusDropdownOpen(false);
                                                        }}
                                                        className={`w-full px-3 py-2 text-left text-xs sm:text-sm transition-colors duration-150 ${
                                                            statusFilter === option.value
                                                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                                                                : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Type Filter - Custom Dropdown */}
                                    <div className="relative" ref={typeDropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-sm hover:shadow-md hover:border-purple-300/50 dark:hover:border-purple-600/50 transition-all duration-200 cursor-pointer min-w-[120px] sm:min-w-[140px]"
                                        >
                                            <CreditCard className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 flex-shrink-0" />
                                            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 flex-1 text-left">
                                                {typeOptions.find(opt => opt.value === typeFilter)?.label || typeOptions[0].label}
                                            </span>
                                            <ChevronDown className={`w-3 h-3 text-gray-400 dark:text-gray-500 transition-transform duration-200 flex-shrink-0 ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        
                                        {isTypeDropdownOpen && (
                                            <div className="absolute top-full left-0 mt-1.5 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-lg z-50 overflow-hidden min-w-full">
                                                {typeOptions.map((option) => (
                                                    <button
                                                        key={option.value}
                                                        type="button"
                                                        onClick={() => {
                                                            setTypeFilter(option.value as 'all' | 'transaction' | 'offer');
                                                            setCurrentPage(1);
                                                            setIsTypeDropdownOpen(false);
                                                        }}
                                                        className={`w-full px-3 py-2 text-left text-xs sm:text-sm transition-colors duration-150 ${
                                                            typeFilter === option.value
                                                                ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium'
                                                                : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400'
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Sort By - Custom Dropdown */}
                                    <div className="relative" ref={sortByDropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsSortByDropdownOpen(!isSortByDropdownOpen)}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-300/50 dark:hover:border-emerald-600/50 transition-all duration-200 cursor-pointer min-w-[100px] sm:min-w-[120px]"
                                        >
                                            <ArrowUpDown className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                                            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 flex-1 text-left">
                                                {sortByOptions.find(opt => opt.value === sortBy)?.label || sortByOptions[0].label}
                                            </span>
                                            <ChevronDown className={`w-3 h-3 text-gray-400 dark:text-gray-500 transition-transform duration-200 flex-shrink-0 ${isSortByDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        
                                        {isSortByDropdownOpen && (
                                            <div className="absolute top-full left-0 mt-1.5 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-lg z-50 overflow-hidden min-w-full">
                                                {sortByOptions.map((option) => (
                                                    <button
                                                        key={option.value}
                                                        type="button"
                                                        onClick={() => {
                                                            setSortBy(option.value as 'date' | 'amount');
                                                            setCurrentPage(1);
                                                            setIsSortByDropdownOpen(false);
                                                        }}
                                                        className={`w-full px-3 py-2 text-left text-xs sm:text-sm transition-colors duration-150 ${
                                                            sortBy === option.value
                                                                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium'
                                                                : 'text-gray-700 dark:text-gray-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400'
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Sort Order - Custom Dropdown */}
                                    <div className="relative" ref={sortOrderDropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsSortOrderDropdownOpen(!isSortOrderDropdownOpen)}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-sm hover:shadow-md hover:border-amber-300/50 dark:hover:border-amber-600/50 transition-all duration-200 cursor-pointer min-w-[100px] sm:min-w-[120px]"
                                        >
                                            <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 flex-shrink-0" />
                                            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 flex-1 text-left">
                                                {sortOrderOptions.find(opt => opt.value === sortOrder)?.label || sortOrderOptions[0].label}
                                            </span>
                                            <ChevronDown className={`w-3 h-3 text-gray-400 dark:text-gray-500 transition-transform duration-200 flex-shrink-0 ${isSortOrderDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        
                                        {isSortOrderDropdownOpen && (
                                            <div className="absolute top-full left-0 mt-1.5 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-lg z-50 overflow-hidden min-w-full">
                                                {sortOrderOptions.map((option) => (
                                                    <button
                                                        key={option.value}
                                                        type="button"
                                                        onClick={() => {
                                                            setSortOrder(option.value as 'desc' | 'asc');
                                                            setCurrentPage(1);
                                                            setIsSortOrderDropdownOpen(false);
                                                        }}
                                                        className={`w-full px-3 py-2 text-left text-xs sm:text-sm transition-colors duration-150 ${
                                                            sortOrder === option.value
                                                                ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-medium'
                                                                : 'text-gray-700 dark:text-gray-300 hover:bg-amber-50/50 dark:hover:bg-amber-900/20 hover:text-amber-600 dark:hover:text-amber-400'
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Reset Filters Button - Custom Soft Design */}
                                    {hasActiveFilters && (
                                        <button
                                            onClick={handleResetFilters}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 backdrop-blur-sm border border-red-200/60 dark:border-red-800/60 rounded-xl shadow-sm hover:shadow-md hover:border-red-300/70 dark:hover:border-red-700/70 transition-all duration-200 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs sm:text-sm font-medium"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" />
                                            <span className="hidden sm:inline">{t('customers.modal.transactions.resetFilters', { defaultValue: 'Reset' })}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                <span className="ml-3 text-gray-600 dark:text-gray-400">
                                    {t('customers.modal.transactions.loading')}
                                </span>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Receipt className="w-12 h-12 text-gray-400 mb-3" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    {hasActiveFilters
                                        ? t('customers.modal.transactions.noMatchingTransactions', { defaultValue: 'No transactions match your filters' })
                                        : t('customers.modal.transactions.noTransactions')
                                    }
                                </p>
                                {hasActiveFilters && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleResetFilters}
                                        className="mt-3"
                                    >
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        {t('customers.modal.transactions.clearFilters', { defaultValue: 'Clear Filters' })}
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50 dark:bg-[#262626]">
                                                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <Receipt className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        <span className="hidden sm:inline">{t('transactions.table.orderId')}</span>
                                                        <span className="sm:hidden">Order</span>
                                                    </div>
                                                </TableHead>
                                                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-xs sm:text-sm hidden sm:table-cell">
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        {t('transactions.table.date')}
                                                    </div>
                                                </TableHead>
                                                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        <span className="hidden sm:inline">{t('transactions.table.amount')}</span>
                                                        <span className="sm:hidden">Amount</span>
                                                    </div>
                                                </TableHead>
                                                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        <span className="hidden sm:inline">{t('transactions.table.status')}</span>
                                                        <span className="sm:hidden">Status</span>
                                                    </div>
                                                </TableHead>
                                                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                                                    <span className="hidden sm:inline">{t('transactions.table.actions')}</span>
                                                    <span className="sm:hidden">Action</span>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {transactions.map((transaction) => (
                                                <TableRow
                                                    key={transaction.id}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                                >
                                                    <TableCell className="font-mono text-xs sm:text-sm">
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold">{transaction.order_id}</span>
                                                            <span className="text-gray-500 dark:text-gray-400 sm:hidden text-xs">
                                                                {formatDateTime(transaction.transaction_date)}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm hidden sm:table-cell">
                                                        {formatDateTime(transaction.transaction_date)}
                                                    </TableCell>
                                                    <TableCell className="font-semibold text-xs sm:text-sm">
                                                        {formatIQDWithSymbol(transaction.grand_total)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1 sm:gap-2">
                                                            {getStatusIcon(transaction.status)}
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                                                <span className="hidden sm:inline">{getStatusText(transaction.status)}</span>
                                                                <span className="sm:hidden">{getStatusText(transaction.status).charAt(0).toUpperCase()}</span>
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {transaction.status === 'debt' && (
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handlePayDebt(transaction)}
                                                                    className="bg-[#10b981] hover:bg-[#059669] text-white text-xs px-2 sm:px-3 py-1 h-6 sm:h-8"
                                                                >
                                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                                    <span className="hidden sm:inline">{t('transactions.table.payDebt')}</span>
                                                                    <span className="sm:hidden">{t('transactions.table.payDebt')}</span>
                                                                </Button>
                                                            )}
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handlePrintTransaction(transaction)}
                                                                disabled={printingTransactionId === transaction.id}
                                                                title={printLabel}
                                                                className="h-6 sm:h-8 w-6 sm:w-8 p-0 border-[#8b5cf6] dark:border-[#8b5cf6] text-[#8b5cf6] dark:text-[#a78bfa] hover:bg-[#8b5cf6] hover:text-white dark:hover:bg-[#8b5cf6] dark:hover:text-white"
                                                            >
                                                                {printingTransactionId === transaction.id ? (
                                                                    <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                                                                ) : (
                                                                    <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                )}
                                                            </Button>
                                                            {/* Edit Button - Only for transactions (not offers) */}
                                                            {transaction.type === 'transaction' && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleEditTransaction(transaction)}
                                                                    title={t('transactions.actions.edit')}
                                                                    className="h-6 sm:h-8 w-6 sm:w-8 p-0 border-orange-500 dark:border-orange-500 text-orange-500 dark:text-orange-400 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white"
                                                                >
                                                                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                </Button>
                                                            )}
                                                            {/* Delete Button - Only for transactions (not offers) */}
                                                            {transaction.type === 'transaction' && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleDeleteTransaction(transaction)}
                                                                    title={t('transactions.actions.delete')}
                                                                    className="h-6 sm:h-8 w-6 sm:w-8 p-0 border-red-500 dark:border-red-500 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white"
                                                                >
                                                                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a]">
                                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                            {t('customers.modal.transactions.page')} {currentPage} {t('customers.modal.transactions.of')} {totalPages}
                                        </div>
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(1)}
                                                disabled={currentPage === 1}
                                                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                                            >
                                                <ChevronsLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                                            >
                                                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </Button>
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                                                    if (pageNum > totalPages) return null;
                                                    return (
                                                        <Button
                                                            key={pageNum}
                                                            variant={currentPage === pageNum ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => handlePageChange(pageNum)}
                                                            className={`h-7 w-7 sm:h-8 sm:w-8 p-0 text-xs ${
                                                                currentPage === pageNum 
                                                                    ? 'bg-[#F58E18] hover:bg-[#EA580C] text-white' 
                                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                                            }`}
                                                        >
                                                            {pageNum}
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                                            >
                                                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(totalPages)}
                                                disabled={currentPage === totalPages}
                                                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                                            >
                                                <ChevronsRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 lg:p-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a]">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <span>{t('customers.modal.transactions.totalRecords')}: {totalTransactionCount}</span>
                        {totalDebtAmount > 0 && (
                            <span className="text-red-600 dark:text-red-400 font-medium">
                                • {t('customers.modal.transactions.totalDebt')}: {formatIQDWithSymbol(totalDebtAmount)}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="h-8 sm:h-9 px-4 sm:px-6 text-xs sm:text-sm border-gray-300 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#262626]/50 transition-all duration-200"
                        >
                            {t('customers.modal.transactions.buttons.close')}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Delete Transaction Modal */}
            <DeleteTransactionModal
                transaction={transactionToDelete}
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onTransactionDeleted={handleTransactionDeleted}
            />
        </div>
    );
}

function generateDebtSummaryTemplate(
    customer: Customer,
    debtTransactions: Transaction[],
    totalDebtAmount: number,
    settings: InvoiceSettings | Record<string, unknown>
): string {
    const escape = (value: string | number | null | undefined) => {
        if (value === null || value === undefined) {
            return '';
        }

        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    const defaultSettings = {
        header_color: '#f97316',
        footer_color: '#f97316',
        table_header_color: '#f97316',
        primary_font: 'Arial',
        font_size_base: 12,
        font_weight: '400',
        logo_width: 90,
        logo_height: 90,
        logo_url: undefined,
        company_title: 'DEBT STATEMENT',
        company_name: 'Haji Printing',
        company_address: 'Erbil-Ehsa Street, Near Sarhad Stationery',
        company_phone_1: '0751 446 39 59',
        company_phone_2: '0751 447 39 59',
        company_email: 'info@hajiprinting.com',
        company_website: 'www.hajiprinting.com',
        header_height: 60,
        footer_height: 40,
        show_logo: true,
        show_company_info: true,
        show_date_time: true,
    };

    const finalSettings = { ...defaultSettings, ...(settings as Record<string, unknown>) } as typeof defaultSettings;

    const getAssetUrl = (path: string) => {
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        const currentPath = window.location.pathname;
        const subdirectoryMatch = currentPath.match(/^(\/[^/]+\/public)/);

        if (subdirectoryMatch) {
            return `${window.location.origin}${subdirectoryMatch[1]}/${cleanPath}`;
        }

        return `${window.location.origin}/${cleanPath}`;
    };

    const formattedTotal = formatIQDWithSymbol(totalDebtAmount);
    const generatedAt = new Date().toLocaleString();
    const outstandingCount = debtTransactions.length;

    const rowsHtml = debtTransactions.length > 0
        ? debtTransactions.map((transaction, index) => {
            const amount = Number(transaction.grand_total ?? 0);
            const formattedAmount = formatIQDWithSymbol(amount);
            const date = transaction.transaction_date || transaction.created_at;
            const formattedDate = date ? new Date(date).toLocaleString() : '';

            return `
                <tr>
                    <td class="text-center">${index + 1}</td>
                    <td>${escape(transaction.order_id || '-')}</td>
                    <td>${escape(formattedDate)}</td>
                    <td class="text-right">${escape(formattedAmount)}</td>
                </tr>
            `;
        }).join('')
        : `
            <tr>
                <td colspan="4" class="no-data">No debt transactions found for this customer.</td>
            </tr>
        `;

    return `<?xml encoding="UTF-8"?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Debt Statement ${escape(customer.name)}</title>
    <style>
        @font-face {
            font-family: 'NotoSansArabic-Regular';
            src: url('${getAssetUrl('fonts/NotoSansArabic-Regular.ttf')}') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        @font-face {
            font-family: 'NotoSansArabic-Regular';
            src: url('${getAssetUrl('fonts/NotoSansArabic-Bold.ttf')}') format('truetype');
            font-weight: bold;
            font-style: normal;
        }
        @page {
            size: A4;
            margin: 0;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'NotoSansArabic-Regular', 'DejaVu Sans', ${finalSettings.primary_font}, sans-serif;
            background: white;
            color: #000;
            font-size: ${finalSettings.font_size_base}px;
            font-weight: ${finalSettings.font_weight || '400'};
            line-height: 1.2;
            position: relative;
            direction: ltr;
            unicode-bidi: embed;
        }

        .statement-container {
            width: 210mm;
            min-height: 297mm;
            background: white;
            margin: 0;
            padding: 0;
        }

        .header {
            background: ${finalSettings.header_color};
            height: ${finalSettings.header_height}px;
            width: 100%;
            position: relative;
        }

        .footer {
            background: ${finalSettings.footer_color};
            height: ${finalSettings.footer_height}px;
            width: 100%;
            position: absolute;
            bottom: 0;
        }

        .content {
            padding: 20px 40px;
            min-height: calc(297mm - 100px);
        }

        .statement-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            position: relative;
        }

        .company-info {
            flex: 1;
            max-width: 70%;
        }

        .company-title {
            font-size: ${finalSettings.font_size_base * 2}px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .company-name {
            font-size: ${finalSettings.font_size_base * 1.33}px;
            font-weight: bold;
            margin-bottom: 8px;
        }

        .company-details {
            font-size: ${finalSettings.font_size_base * 0.92}px;
            line-height: 1.4;
            color: #333;
        }

        .logo-section {
            position: absolute;
            top: 0;
            right: 0;
            text-align: right;
            width: auto;
            height: auto;
        }

        .logo {
            width: ${finalSettings.logo_width}px;
            height: ${finalSettings.logo_height}px;
            background: transparent;
            border: none;
            display: block;
            overflow: visible;
        }

        .logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
            background: transparent;
            border: none;
        }

        .statement-meta {
            text-align: left;
            font-size: ${finalSettings.font_size_base * 0.83}px;
            line-height: 1.4;
            max-width: 140px;
            margin-top: 15px;
        }

        .statement-meta div {
            margin-bottom: 3px;
            word-wrap: break-word;
        }

        .customer-section {
            margin-bottom: 25px;
            padding: 16px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background: #f8f9ff;
        }

        .customer-label {
            font-size: ${finalSettings.font_size_base}px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .customer-info {
            font-size: ${finalSettings.font_size_base * 0.92}px;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .items-table th {
            background: ${finalSettings.table_header_color};
            color: white;
            padding: 8px 6px;
            text-align: left;
            font-size: ${finalSettings.font_size_base * 0.92}px;
            font-weight: bold;
        }

        .items-table th.text-center,
        .items-table td.text-center {
            text-align: center;
        }

        .items-table th.text-right,
        .items-table td.text-right {
            text-align: right;
        }

        .items-table td {
            padding: 6px;
            border-bottom: 1px solid #e0e0e0;
            font-size: ${finalSettings.font_size_base * 0.92}px;
            vertical-align: top;
        }

        .items-table tbody tr:nth-child(even) {
            background-color: #f8f9ff;
        }

        .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
        }

        .totals-table {
            border: 1px solid #ddd;
            min-width: 240px;
        }

        .totals-table tr td {
            padding: 8px 10px;
            font-size: ${finalSettings.font_size_base * 0.92}px;
            border-bottom: 1px solid #eee;
        }

        .totals-table tr:last-child td {
            border-bottom: none;
            background: ${finalSettings.table_header_color};
            color: white;
            font-weight: bold;
        }

        .no-data {
            text-align: center;
            padding: 20px;
            color: #666;
            font-style: italic;
        }

        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="statement-container">
        <div class="header"></div>
        <div class="content">
            <div class="statement-header">
                <div class="company-info">
                    <div class="company-title">${escape(finalSettings.company_title || 'DEBT STATEMENT')}</div>
                    <div class="company-name">${escape(finalSettings.company_name)}</div>
                    ${finalSettings.show_company_info ? `
                    <div class="company-details">
                        ${finalSettings.company_address ? `${escape(finalSettings.company_address)}<br>` : ''}
                        ${finalSettings.company_phone_1 ? `${escape(finalSettings.company_phone_1)}<br>` : ''}
                        ${finalSettings.company_phone_2 ? `${escape(finalSettings.company_phone_2)}<br>` : ''}
                        ${finalSettings.company_email ? `Email: ${escape(finalSettings.company_email)}<br>` : ''}
                        ${finalSettings.company_website ? escape(finalSettings.company_website) : ''}
                    </div>
                    ` : ''}
                    <div class="statement-meta">
                        <div><strong>Generated:</strong> ${escape(generatedAt)}</div>
                        <div><strong>Outstanding:</strong> ${escape(formattedTotal)}</div>
                        <div><strong>Invoices:</strong> ${escape(outstandingCount)}</div>
                    </div>
                </div>
                ${finalSettings.show_logo ? `
                <div class="logo-section">
                    <div class="logo" style="width: ${finalSettings.logo_width}px; height: ${finalSettings.logo_height}px;">
                        <img src="${finalSettings.logo_url || getAssetUrl('images/hajiNoBackground.png')}" alt="Company Logo">
                    </div>
                </div>
                ` : ''}
            </div>

            <div class="customer-section">
                <div class="customer-label">Customer Information</div>
                <div class="customer-info">
                    <div><strong>${escape(customer.name)}</strong></div>
                    ${customer.email ? `<div>Email: ${escape(customer.email)}</div>` : ''}
                    ${customer.phone ? `<div>Phone: ${escape(customer.phone)}</div>` : ''}
                    <div>Customer ID: ${escape(customer.id)}</div>
                </div>
            </div>

            <table class="items-table">
                <thead>
                    <tr>
                        <th class="text-center" style="width: 60px;">#</th>
                        <th>Order ID</th>
                        <th style="width: 180px;">Transaction Date</th>
                        <th class="text-right" style="width: 140px;">Outstanding Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                    ${debtTransactions.length > 0 ? `
                    <tr>
                        <td colspan="3" class="text-right"><strong>Total Outstanding</strong></td>
                        <td class="text-right"><strong>${escape(formattedTotal)}</strong></td>
                    </tr>
                    ` : ''}
                </tbody>
            </table>

            <div class="totals-section">
                <table class="totals-table">
                    <tr>
                        <td>Total outstanding invoices</td>
                        <td class="text-right">${escape(outstandingCount)}</td>
                    </tr>
                    <tr>
                        <td><strong>Total amount due</strong></td>
                        <td class="text-right"><strong>${escape(formattedTotal)}</strong></td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="footer"></div>
    </div>
</body>
</html>`;
}

function generatePaidSummaryTemplate(
    customer: Customer,
    paidTransactions: Transaction[],
    totalPaidAmount: number,
    settings: InvoiceSettings | Record<string, unknown>
): string {
    const escape = (value: string | number | null | undefined) => {
        if (value === null || value === undefined) {
            return '';
        }

        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    const defaultSettings = {
        header_color: '#f97316',
        footer_color: '#f97316',
        table_header_color: '#f97316',
        primary_font: 'Arial',
        font_size_base: 12,
        font_weight: '400',
        logo_width: 90,
        logo_height: 90,
        logo_url: undefined,
        company_title: 'PAID STATEMENT',
        company_name: 'Haji Printing',
        company_address: 'Erbil-Ehsa Street, Near Sarhad Stationery',
        company_phone_1: '0751 446 39 59',
        company_phone_2: '0751 447 39 59',
        company_email: 'info@hajiprinting.com',
        company_website: 'www.hajiprinting.com',
        header_height: 60,
        footer_height: 40,
        show_logo: true,
        show_company_info: true,
        show_date_time: true,
    };

    const finalSettings = { ...defaultSettings, ...(settings as Record<string, unknown>) } as typeof defaultSettings;

    const getAssetUrl = (path: string) => {
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        const currentPath = window.location.pathname;
        const subdirectoryMatch = currentPath.match(/^(\/[^/]+\/public)/);

        if (subdirectoryMatch) {
            return `${window.location.origin}${subdirectoryMatch[1]}/${cleanPath}`;
        }

        return `${window.location.origin}/${cleanPath}`;
    };

    const formattedTotal = formatIQDWithSymbol(totalPaidAmount);
    const generatedAt = new Date().toLocaleString();
    const paidCount = paidTransactions.length;

    const rowsHtml = paidTransactions.length > 0
        ? paidTransactions.map((transaction, index) => {
            const amount = Number(transaction.grand_total ?? 0);
            const formattedAmount = formatIQDWithSymbol(amount);
            const date = transaction.transaction_date || transaction.created_at;
            const formattedDate = date ? new Date(date).toLocaleString() : '';

            return `
                <tr>
                    <td class="text-center">${index + 1}</td>
                    <td>${escape(transaction.order_id || '-')}</td>
                    <td>${escape(formattedDate)}</td>
                    <td class="text-right">${escape(formattedAmount)}</td>
                </tr>
            `;
        }).join('')
        : `
            <tr>
                <td colspan="4" class="no-data">No paid transactions found for this customer.</td>
            </tr>
        `;

    return `<?xml encoding="UTF-8"?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paid Statement ${escape(customer.name)}</title>
    <style>
        @font-face {
            font-family: 'NotoSansArabic-Regular';
            src: url('${getAssetUrl('fonts/NotoSansArabic-Regular.ttf')}') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        @font-face {
            font-family: 'NotoSansArabic-Regular';
            src: url('${getAssetUrl('fonts/NotoSansArabic-Bold.ttf')}') format('truetype');
            font-weight: bold;
            font-style: normal;
        }
        @page {
            size: A4;
            margin: 0;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'NotoSansArabic-Regular', 'DejaVu Sans', ${finalSettings.primary_font}, sans-serif;
            background: white;
            color: #000;
            font-size: ${finalSettings.font_size_base}px;
            font-weight: ${finalSettings.font_weight || '400'};
            line-height: 1.2;
            position: relative;
            direction: ltr;
            unicode-bidi: embed;
        }

        .statement-container {
            width: 210mm;
            min-height: 297mm;
            background: white;
            margin: 0;
            padding: 0;
        }

        .header {
            background: ${finalSettings.header_color};
            height: ${finalSettings.header_height}px;
            width: 100%;
            position: relative;
        }

        .footer {
            background: ${finalSettings.footer_color};
            height: ${finalSettings.footer_height}px;
            width: 100%;
            position: absolute;
            bottom: 0;
        }

        .content {
            padding: 20px 40px;
            min-height: calc(297mm - 100px);
        }

        .statement-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            position: relative;
        }

        .company-info {
            flex: 1;
            max-width: 70%;
        }

        .company-title {
            font-size: ${finalSettings.font_size_base * 2}px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .company-name {
            font-size: ${finalSettings.font_size_base * 1.33}px;
            font-weight: bold;
            margin-bottom: 8px;
        }

        .company-details {
            font-size: ${finalSettings.font_size_base * 0.92}px;
            line-height: 1.4;
            color: #333;
        }

        .logo-section {
            position: absolute;
            top: 0;
            right: 0;
            text-align: right;
            width: auto;
            height: auto;
        }

        .logo {
            width: ${finalSettings.logo_width}px;
            height: ${finalSettings.logo_height}px;
            background: transparent;
            border: none;
            display: block;
            overflow: visible;
        }

        .logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
            background: transparent;
            border: none;
        }

        .statement-meta {
            text-align: left;
            font-size: ${finalSettings.font_size_base * 0.83}px;
            line-height: 1.4;
            max-width: 140px;
            margin-top: 15px;
        }

        .statement-meta div {
            margin-bottom: 3px;
            word-wrap: break-word;
        }

        .customer-section {
            margin-bottom: 25px;
            padding: 16px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background: #f8f9ff;
        }

        .customer-label {
            font-size: ${finalSettings.font_size_base}px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .customer-info {
            font-size: ${finalSettings.font_size_base * 0.92}px;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .items-table th {
            background: ${finalSettings.table_header_color};
            color: white;
            padding: 8px 6px;
            text-align: left;
            font-size: ${finalSettings.font_size_base * 0.92}px;
            font-weight: bold;
        }

        .items-table th.text-center,
        .items-table td.text-center {
            text-align: center;
        }

        .items-table th.text-right,
        .items-table td.text-right {
            text-align: right;
        }

        .items-table td {
            padding: 6px;
            border-bottom: 1px solid #e0e0e0;
            font-size: ${finalSettings.font_size_base * 0.92}px;
            vertical-align: top;
        }

        .items-table tbody tr:nth-child(even) {
            background-color: #f8f9ff;
        }

        .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
        }

        .totals-table {
            border: 1px solid #ddd;
            min-width: 240px;
        }

        .totals-table tr td {
            padding: 8px 10px;
            font-size: ${finalSettings.font_size_base * 0.92}px;
            border-bottom: 1px solid #eee;
        }

        .totals-table tr:last-child td {
            border-bottom: none;
            background: ${finalSettings.table_header_color};
            color: white;
            font-weight: bold;
        }

        .no-data {
            text-align: center;
            padding: 20px;
            color: #666;
            font-style: italic;
        }

        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="statement-container">
        <div class="header"></div>
        <div class="content">
            <div class="statement-header">
                <div class="company-info">
                    <div class="company-title">${escape(finalSettings.company_title || 'PAID STATEMENT')}</div>
                    <div class="company-name">${escape(finalSettings.company_name)}</div>
                    ${finalSettings.show_company_info ? `
                    <div class="company-details">
                        ${finalSettings.company_address ? `${escape(finalSettings.company_address)}<br>` : ''}
                        ${finalSettings.company_phone_1 ? `${escape(finalSettings.company_phone_1)}<br>` : ''}
                        ${finalSettings.company_phone_2 ? `${escape(finalSettings.company_phone_2)}<br>` : ''}
                        ${finalSettings.company_email ? `Email: ${escape(finalSettings.company_email)}<br>` : ''}
                        ${finalSettings.company_website ? escape(finalSettings.company_website) : ''}
                    </div>
                    ` : ''}
                    <div class="statement-meta">
                        <div><strong>Generated:</strong> ${escape(generatedAt)}</div>
                        <div><strong>Total Paid:</strong> ${escape(formattedTotal)}</div>
                        <div><strong>Invoices:</strong> ${escape(paidCount)}</div>
                    </div>
                </div>
                ${finalSettings.show_logo ? `
                <div class="logo-section">
                    <div class="logo" style="width: ${finalSettings.logo_width}px; height: ${finalSettings.logo_height}px;">
                        <img src="${finalSettings.logo_url || getAssetUrl('images/hajiNoBackground.png')}" alt="Company Logo">
                    </div>
                </div>
                ` : ''}
            </div>

            <div class="customer-section">
                <div class="customer-label">Customer Information</div>
                <div class="customer-info">
                    <div><strong>${escape(customer.name)}</strong></div>
                    ${customer.email ? `<div>Email: ${escape(customer.email)}</div>` : ''}
                    ${customer.phone ? `<div>Phone: ${escape(customer.phone)}</div>` : ''}
                    <div>Customer ID: ${escape(customer.id)}</div>
                </div>
            </div>

            <table class="items-table">
                <thead>
                    <tr>
                        <th class="text-center" style="width: 60px;">#</th>
                        <th>Order ID</th>
                        <th style="width: 180px;">Transaction Date</th>
                        <th class="text-right" style="width: 140px;">Paid Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                    ${paidTransactions.length > 0 ? `
                    <tr>
                        <td colspan="3" class="text-right"><strong>Total Paid</strong></td>
                        <td class="text-right"><strong>${escape(formattedTotal)}</strong></td>
                    </tr>
                    ` : ''}
                </tbody>
            </table>

            <div class="totals-section">
                <table class="totals-table">
                    <tr>
                        <td>Total paid invoices</td>
                        <td class="text-right">${escape(paidCount)}</td>
                    </tr>
                    <tr>
                        <td><strong>Total amount paid</strong></td>
                        <td class="text-right"><strong>${escape(formattedTotal)}</strong></td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="footer"></div>
    </div>
</body>
</html>`;
}
