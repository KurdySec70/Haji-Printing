import React, { useState, useEffect, useCallback } from 'react';
import CustomerLayout from '@/layouts/customer-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { transformRoute } from '@/utils/routeHelper';
import { generateInvoiceTemplate } from '@/utils/invoice-template';
import { formatIQDWithSymbol } from '@/lib/currency';
import { Transaction, Customer } from '@/types';
import { 
    User, 
    Mail, 
    Phone, 
    TrendingUp, 
    Clock, 
    CheckCircle, 
    AlertTriangle,
    Receipt,
    Sparkles,
    Zap,
    Target,
    Search,
    ChevronLeft,
    ChevronRight,
    Eye,
    Printer,
    X
} from 'lucide-react';


interface CustomerDashboardProps {
    customer: Customer;
    stats?: {
        total_transactions: number;
        total_spent: number;
        paid_transactions: number;
        debt_transactions: number;
        offer_transactions: number;
        debt_amount: number;
        paid_amount: number;
        last_order_date: string | null;
    };
}

export default function CustomerDashboard({ customer, stats }: CustomerDashboardProps) {
    const { t } = useTranslation();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const itemsPerPage = 10;
    
    // Preview modal state
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    

    const breadcrumbs = [
        { title: t('customer.dashboard.title'), href: '/customer/dashboard' },
    ];




    const fetchCustomerTransactions = useCallback(async (page = 1, search = '') => {
        if (!customer?.id) return;
        
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: itemsPerPage.toString(),
            });
            
            if (search.trim()) {
                params.append('search', search.trim());
            }
            
            const response = await fetch(transformRoute(`/customer/api/transactions?${params}`), {
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
            
            if (data.success && data.transactions) {
                setTransactions(data.transactions.data || []);
                setTotalPages(data.transactions.last_page || 1);
                setTotalTransactions(data.transactions.total || 0);
                setCurrentPage(data.transactions.current_page || 1);
            } else {
                setTransactions([]);
                setTotalPages(1);
                setTotalTransactions(0);
            }
        } catch {
            setTransactions([]);
            setTotalPages(1);
            setTotalTransactions(0);
        } finally {
            setLoading(false);
        }
    }, [customer?.id]);

    // Fetch transactions using the same API approach as transaction detail modal
    useEffect(() => {
        if (customer?.id) {
            fetchCustomerTransactions();
        }
    }, [customer?.id, fetchCustomerTransactions]);



    // Search and pagination handlers
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
        fetchCustomerTransactions(1, value);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchCustomerTransactions(page, searchTerm);
    };

    // Preview transaction function
    const handlePreviewTransaction = async (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setPreviewModalOpen(true);
    };

    const handleClosePreviewModal = () => {
        setPreviewModalOpen(false);
        setSelectedTransaction(null);
    };

    const handlePrintInvoice = async (transaction: Transaction) => {
        try {
            // Fetch invoice settings
            const response = await fetch('/customer/api/invoice-settings');
            const data = await response.json();
            const settings = data.settings || {};

            const printContent = generateInvoiceTemplate(transaction, settings);
            
            // Cache settings for potential reuse
            (window as unknown as Record<string, unknown>).invoiceSettings = settings;

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
            console.error('Failed to load invoice settings:', error);
            // Fallback to default template (still try to use any cached settings)
            const cachedSettings = (window as unknown as Record<string, unknown>).invoiceSettings;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const printContent = generateInvoiceTemplate(transaction, cachedSettings as any || undefined);
            
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

                iframe.onload = () => {
                    setTimeout(() => {
                        iframe.contentWindow?.print();
                        setTimeout(() => {
                            document.body.removeChild(iframe);
                        }, 1000);
                    }, 100);
                };
            }
        }
    };



    // Listen for new transactions detected by the header notification system
    useEffect(() => {
        const handleNewTransactions = () => {
            // Refresh the dashboard when new transactions are detected
            fetchCustomerTransactions(currentPage, searchTerm);
        };

        window.addEventListener('newTransactionsDetected', handleNewTransactions as EventListener);
        return () => window.removeEventListener('newTransactionsDetected', handleNewTransactions as EventListener);
    }, [fetchCustomerTransactions, currentPage, searchTerm]);


    // Use real debt amount from backend
    const debtAmount = stats?.debt_amount || 0;

    // Format last order date
    // const getLastOrderText = () => {
    //     if (!stats?.last_order_date) return t('customer.dashboard.noOrdersYet');
    //     
    //     const lastOrderDate = new Date(stats.last_order_date);
    //     const now = new Date();
    //     const diffTime = Math.abs(now.getTime() - lastOrderDate.getTime());
    //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    //     
    //     if (diffDays === 1) return t('customer.dashboard.dayAgo', { count: 1 });
    //     if (diffDays < 7) return t('customer.dashboard.daysAgo', { count: diffDays });
    //     if (diffDays < 30) return t('customer.dashboard.weeksAgo', { count: Math.floor(diffDays / 7) });
    //     return t('customer.dashboard.monthsAgo', { count: Math.floor(diffDays / 30) });
    // };

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
                    return <Clock className="w-4 h-4" />;
                case 'accepted_paid':
                    return <CheckCircle className="w-4 h-4" />;
                case 'accepted_debt':
                    return <AlertTriangle className="w-4 h-4" />;
                case 'rejected':
                    return <AlertTriangle className="w-4 h-4" />;
                default:
                    return <Clock className="w-4 h-4" />;
            }
        } else {
            switch (transaction.status) {
                case 'paid':
                    return <CheckCircle className="w-4 h-4" />;
                case 'debt':
                    return <AlertTriangle className="w-4 h-4" />;
                default:
                    return <Clock className="w-4 h-4" />;
            }
        }
    };

    const getStatusText = (transaction: Transaction) => {
        if (transaction.type === 'offer') {
            switch (transaction.offer_status) {
                case 'pending':
                    return t('customer.dashboard.offerStatus.pending');
                case 'accepted_paid':
                    return t('customer.dashboard.offerStatus.acceptedPaid');
                case 'accepted_debt':
                    return t('customer.dashboard.offerStatus.acceptedDebt');
                case 'rejected':
                    return t('customer.dashboard.offerStatus.rejected');
                default:
                    return t('customer.dashboard.offerStatus.unknown');
            }
        } else {
            return transaction.status;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IQ', {
            style: 'currency',
            currency: 'IQD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    // const formatProductDetails = (items: TransactionItem[]) => {
    //     if (!items || items.length === 0) return t('customer.dashboard.noItems');
    //     
    //     if (items.length === 1) {
    //         const item = items[0];
    //         if (item.type === 'width*height' && item.width && item.height) {
    //             return `${item.name} (${item.width}×${item.height}cm)`;
    //         }
    //         return `${item.name} (${item.quantity} ${item.type})`;
    //     }
    //     
    //     if (items.length <= 3) {
    //         return items.map(item => {
    //             if (item.type === 'width*height' && item.width && item.height) {
    //                 return `${item.name} (${item.width}×${item.height}cm)`;
    //             }
    //             return `${item.name} (${item.quantity} ${item.type})`;
    //         }).join(', ');
    //     }
    //     
    //     const firstItem = items[0];
    //     const firstItemText = firstItem.type === 'width*height' && firstItem.width && firstItem.height
    //         ? `${firstItem.name} (${firstItem.width}×${firstItem.height}cm)`
    //         : `${firstItem.name} (${firstItem.quantity} ${firstItem.type})`;
    //     
    //     return `${firstItemText} +${items.length - 1} ${t('customer.dashboard.more')}`;
    // };

    return (
        <CustomerLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('customer.dashboard.title')} - ${t('app.name')}`} />
            
            <div className="flex flex-1 flex-col gap-4 sm:gap-6 lg:gap-8 p-3 sm:p-4 lg:p-6 min-h-screen bg-white dark:bg-[#0a0a0a]">
                {/* Hero Section */}
                <div className="relative overflow-hidden">
                    <div className="relative bg-white dark:bg-[#1a1a1a] rounded-lg p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                                <div className="relative flex-shrink-0">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F58E18] rounded-lg flex items-center justify-center shadow-sm">
                                        <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                        <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        {t('customer.dashboard.welcomeBack', { name: customer.name })}
                                    </h1>
                                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-3">
                                        {t('customer.dashboard.printingJourneyOverview')}
                                    </p>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                        {customer.email && (
                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                                <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span className="truncate">{customer.email}</span>
                                            </div>
                                        )}
                                        {customer.phone && (
                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                                <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span className="truncate">{customer.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-center lg:text-right flex-shrink-0">
                                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">{t('customer.dashboard.memberSince')}</div>
                                <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                    {customer.created_at ? new Date(customer.created_at).getFullYear().toString() : '2023'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                    {/* Total Orders */}
                    <div className="group relative overflow-hidden bg-white dark:bg-[#1a1a1a] rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="relative">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm transition-colors duration-200">
                                    <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats?.total_transactions || 0}</div>
                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('customer.dashboard.totalOrders')}</div>
                        </div>
                    </div>

                    {/* Total Spent */}
                    <div className="bg-white dark:bg-[#1a1a1a] rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-lg flex items-center justify-center">
                                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{formatCurrency(stats?.total_spent || 0)}</div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('customer.dashboard.totalSpent')}</div>
                    </div>

                    {/* Paid Amount */}
                    <div className="bg-white dark:bg-[#1a1a1a] rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{formatCurrency(stats?.paid_amount || 0)}</div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('customer.dashboard.paidAmount')}</div>
                    </div>

                    {/* Debt Transactions */}
                    <div className="bg-white dark:bg-[#1a1a1a] rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-lg flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{formatCurrency(debtAmount)}</div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('customer.dashboard.debtAmount')}</div>
                    </div>

                    {/* Offer Transactions */}
                    <div className="bg-white dark:bg-[#1a1a1a] rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats?.offer_transactions || 0}</div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('customer.dashboard.offerTransactions')}</div>
                    </div>
                </div>

                {/* All Transactions Table */}
                <div className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="bg-white dark:bg-[#1a1a1a] px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                {t('customer.dashboard.allTransactions')}
                            </h2>
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                {t('customer.dashboard.totalTransactions', { count: totalTransactions })}
                            </div>
                        </div>
                        
                        {/* Search Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder={t('customer.dashboard.searchPlaceholder')}
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-800 rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                {t('customer.dashboard.loadingTransactions')}
                            </div>
                        ) : Array.isArray(transactions) && transactions.length > 0 ? (
                            <table className="w-full min-w-[800px]">
                                <thead className="bg-white dark:bg-[#1a1a1a]">
                                    <tr>
                                        <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            {t('customer.dashboard.orderId')}
                                        </th>
                                        <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                                            {t('customer.dashboard.date')}
                                        </th>
                                        <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            {t('customer.dashboard.product')}
                                        </th>
                                        <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            {t('customer.dashboard.type')}
                                        </th>
                                        <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            {t('customer.dashboard.qty')}
                                        </th>
                                        <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                                            {t('customer.dashboard.unitPrice')}
                                        </th>
                                        <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            {t('customer.dashboard.total')}
                                        </th>
                                        <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            {t('customer.dashboard.status')}
                                        </th>
                                        <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            {t('customer.dashboard.actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-[#1a1a1a]">
                                    {Array.isArray(transactions) ? transactions.map((transaction, transactionIndex) => 
                                        (Array.isArray(transaction.items) ? transaction.items : []).map((item, itemIndex) => (
                                            <React.Fragment key={`${transaction.id}-${itemIndex}`}>
                                                {/* Transaction Separator */}
                                                {itemIndex === 0 && transactionIndex > 0 && (
                                                    <tr>
                                                        <td colSpan={9} className="px-4 py-2">
                                                            <div className="border-t border-gray-200 dark:border-gray-600"></div>
                                                        </td>
                                                    </tr>
                                                )}
                                                <tr className="hover:bg-gray-50 dark:hover:bg-[#262626]">
                                                    <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                                                        <div className="truncate max-w-[100px] sm:max-w-none">
                                                            {transaction?.order_id || t('customer.dashboard.notAvailable')}
                                                        </div>
                                                    </td>
                                                    <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                                                        {transaction?.transaction_date ? formatDate(transaction.transaction_date) : t('customer.dashboard.notAvailable')}
                                                    </td>
                                                    <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                                                        <div className="truncate max-w-[120px] sm:max-w-none">
                                                            {item?.name || t('customer.dashboard.unknownProduct')}
                                                        </div>
                                                    </td>
                                                    <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                        <div className="space-y-1">
                                                            <div className="truncate">{item?.type || t('customer.dashboard.notAvailable')}</div>
                                                            {item?.type === 'width*height' && item?.dimensions && (
                                                                <div className="text-xs text-gray-400">
                                                                    {item.dimensions}
                                                                </div>
                                                            )}
                                                            {item?.type === 'kg' && item?.weight && (
                                                                <div className="text-xs text-gray-400">
                                                                    {item.weight}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                        {item?.quantity || 0}
                                                    </td>
                                                    <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                                                        {formatCurrency(item?.unit_price || 0)}
                                                    </td>
                                                    <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                                                        {formatCurrency(item?.total || 0)}
                                                    </td>
                                                    <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                                                        <div className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction)}`}>
                                                            {getStatusIcon(transaction)}
                                                            <span className="hidden sm:inline">{getStatusText(transaction)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => handlePreviewTransaction(transaction)}
                                                                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                                                                title={t('customer.dashboard.previewInvoice')}
                                                            >
                                                                <Eye className="w-3 h-3" />
                                                                <span className="hidden sm:inline">{t('customer.dashboard.preview')}</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        ))
                                    ) : null}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                {t('customer.dashboard.noTransactionsFound')}
                            </div>
                        )}
                    </div>
                    
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="bg-white dark:bg-[#1a1a1a] px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-800">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
                                    {t('customer.dashboard.showing')} {((currentPage - 1) * itemsPerPage) + 1} {t('customer.dashboard.to')} {Math.min(currentPage * itemsPerPage, totalTransactions)} {t('customer.dashboard.of')} {totalTransactions} {t('customer.dashboard.transactions')}
                                </div>
                                
                                <div className="flex items-center justify-center sm:justify-end space-x-1 sm:space-x-2">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                        <span className="hidden sm:inline">{t('customer.dashboard.previous')}</span>
                                        <span className="sm:hidden">{t('customer.dashboard.prev')}</span>
                                    </button>
                                    
                                    {/* Page Numbers */}
                                    <div className="flex items-center space-x-1">
                                        {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 2) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 1) {
                                                pageNum = totalPages - 2 + i;
                                            } else {
                                                pageNum = currentPage - 1 + i;
                                            }
                                            
    return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg ${
                                                        currentPage === pageNum
                                                            ? 'bg-[#F58E18] text-white'
                                                            : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-800'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        {totalPages > 3 && (
                                            <span className="px-2 py-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                                ...
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Next Button */}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="hidden sm:inline">{t('customer.dashboard.next')}</span>
                                        <span className="sm:hidden">{t('customer.dashboard.next')}</span>
                                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Custom Preview Invoice Modal */}
                {previewModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        {/* Backdrop */}
                        <div 
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={handleClosePreviewModal}
                        />
                        
                        {/* Modal Container */}
                        <div className="relative bg-white dark:bg-[#0a0a0a] rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="bg-white dark:bg-[#0a0a0a] px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {t('customer.dashboard.previewInvoice')}
                                    </h2>
                                    <button
                                        onClick={handleClosePreviewModal}
                                        className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center cursor-pointer"
                                    >
                                        <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Content - Transaction Details */}
                            <div className="flex-1 overflow-y-auto p-4">
                                {selectedTransaction ? (
                                    <div className="space-y-4">
                                        {/* Transaction Header - Compact */}
                                        <div className="bg-white dark:bg-[#0a0a0a] rounded-lg p-3 border border-gray-200 dark:border-gray-800">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                                        {selectedTransaction.order_id}
                                                    </h3>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                        {new Date(selectedTransaction.transaction_date).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                                <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                                    selectedTransaction.status === 'paid' 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}>
                                                    {selectedTransaction.status === 'paid' ? 'Paid' : 'Debt'}
                                                </div>
                                            </div>
                                            
                                            {/* Compact Stats */}
                                            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                                                <div className="text-center">
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Items</p>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                                                        {selectedTransaction.items?.length || 0}
                                                    </p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Subtotal</p>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                                                        {formatIQDWithSymbol(selectedTransaction.subtotal || 0)}
                                                    </p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                                                    <p className="text-sm font-semibold text-[#F58E18] mt-1">
                                                        {formatIQDWithSymbol(selectedTransaction.grand_total || 0)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items List - Compact */}
                                        <div className="bg-white dark:bg-[#0a0a0a] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                                            <div className="bg-white dark:bg-[#0a0a0a] px-3 py-2 border-b border-gray-200 dark:border-gray-800">
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    Order Items
                                                </h4>
                                            </div>
                                            <div className="divide-y divide-gray-200 dark:divide-gray-800">
                                                {selectedTransaction.items?.map((item, index) => (
                                                    <div key={index} className="p-3">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex-1 min-w-0">
                                                                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1 truncate">
                                                                    {item.name}
                                                                </h5>
                                                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 flex-wrap">
                                                                    <span>{item.type}</span>
                                                                    {item.dimensions && (
                                                                        <span>• {item.dimensions}</span>
                                                                    )}
                                                                    {item.weight && (
                                                                        <span>• {item.weight}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="text-right flex-shrink-0">
                                                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                                                    {item.quantity} × {formatIQDWithSymbol(item.unit_price)}
                                                                </div>
                                                                <div className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                                                                    {formatIQDWithSymbol(item.total)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Transaction Summary - Compact */}
                                        <div className="bg-white dark:bg-[#0a0a0a] rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                                Summary
                                            </h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {formatIQDWithSymbol(selectedTransaction.subtotal || 0)}
                                                    </span>
                                                </div>
                                                {selectedTransaction.discount_amount > 0 && (
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                                                        <span className="font-medium text-green-600 dark:text-green-400">
                                                            -{formatIQDWithSymbol(selectedTransaction.discount_amount)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="border-t border-gray-200 dark:border-gray-800 pt-2 mt-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Total:</span>
                                                        <span className="text-base font-bold text-[#F58E18]">
                                                            {formatIQDWithSymbol(selectedTransaction.grand_total || 0)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Notes - Compact */}
                                        {selectedTransaction.notes && (
                                            <div className="bg-white dark:bg-[#0a0a0a] rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                                    Notes
                                                </h4>
                                                <p className="text-xs text-gray-700 dark:text-gray-300">
                                                    {selectedTransaction.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full py-8">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#F58E18] mx-auto mb-2"></div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Loading...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Footer - Compact */}
                            <div className="bg-white dark:bg-[#0a0a0a] px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={handleClosePreviewModal}
                                        className="px-3 py-1.5 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm font-medium cursor-pointer"
                                    >
                                        {t('common.close')}
                                    </button>
                                    <button
                                        onClick={() => selectedTransaction && handlePrintInvoice(selectedTransaction)}
                                        className="px-3 py-1.5 bg-[#F58E18] text-white rounded text-sm font-medium flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <Printer className="w-3.5 h-3.5" />
                                        {t('customer.dashboard.printInvoice')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </CustomerLayout>
    );
}
