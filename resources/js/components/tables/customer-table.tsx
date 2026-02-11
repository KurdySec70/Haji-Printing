import { useState, useEffect, useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { 
    ChevronLeft, 
    ChevronRight, 
    ChevronsLeft, 
    ChevronsRight, 
    Edit,
    Trash2,
    User,
    Mail,
    Phone,
    UserCheck,
    Calendar,
    RefreshCw,
    Search,
    Receipt,
    Printer,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface PaginationInfo {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
}

interface CustomerTableProps {
    customers: Customer[];
    loading?: boolean;
    onEdit?: (customer: Customer) => void;
    onDelete?: (customer: Customer) => void;
    onViewTransactions?: (customer: Customer) => void;
    onPrintReceipt?: (customer: Customer) => void;
    className?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    pagination?: PaginationInfo;
}

interface PaginationState {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

const CustomerTable = memo(function CustomerTable({
    customers,
    loading = false,
    onEdit,
    onDelete,
    onViewTransactions,
    onPrintReceipt,
    className = '',
    pagination: externalPagination
}: CustomerTableProps) {
    const { t } = useTranslation();
    
    // State management
    const [searchTerm, setSearchTerm] = useState('');
    const [localPagination, setLocalPagination] = useState<PaginationState>({
        currentPage: 1,
        pageSize: 25,
        totalItems: customers.length,
        totalPages: Math.ceil(customers.length / 25)
    });

    const pagination = externalPagination ? {
        currentPage: externalPagination.currentPage,
        pageSize: externalPagination.perPage,
        totalItems: externalPagination.total,
        totalPages: externalPagination.lastPage
    } : localPagination;
    
    // Filter customers based on search term
    const filteredCustomers = useMemo(() => {
        if (!searchTerm) return customers;
        
        const term = searchTerm.toLowerCase();
        return customers.filter(customer => 
            customer.name.toLowerCase().includes(term) ||
            (customer.email && customer.email.toLowerCase().includes(term)) ||
            (customer.phone && customer.phone.toLowerCase().includes(term)) ||
            customer.username.toLowerCase().includes(term)
        );
    }, [customers, searchTerm]);

    // Update local pagination when filtered customers change (only if not using external pagination)
    useEffect(() => {
        if (!externalPagination) {
            const totalPages = Math.ceil(filteredCustomers.length / localPagination.pageSize);
            setLocalPagination(prev => ({
                ...prev,
                totalItems: filteredCustomers.length,
                totalPages,
                currentPage: 1 // Reset to first page when search changes
            }));
        }
    }, [filteredCustomers, localPagination.pageSize, externalPagination]);

    // Get paginated customers (only slice if using local pagination)
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;

    const paginatedCustomers = externalPagination
        ? filteredCustomers  // Data is already paginated from server
        : filteredCustomers.slice(startIndex, endIndex);

    // Handle pagination
    const handlePageChange = (page: number) => {
        if (externalPagination) {
            // For external pagination, make a server request
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('page', page.toString());
            window.location.href = currentUrl.toString();
        } else {
            // For local pagination, update state
            setLocalPagination(prev => ({ ...prev, currentPage: page }));
        }
    };

    // Format role display
    const formatRole = (role: string) => {
        const roleColors = {
            admin: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
            cashier: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
            customer: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
        };
        
        const roleLabels = {
            admin: t('customers.filters.admin'),
            cashier: t('customers.filters.cashier'),
            customer: t('customers.filters.customer')
        };

        return (
            <span className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                                    roleColors[role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800 dark:bg-[#262626] dark:text-gray-300'
            )}>
                {roleLabels[role as keyof typeof roleLabels] || role}
            </span>
        );
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className={cn("w-full relative z-20", className)}>
            {/* Main Container */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-visible">
                {/* Header */}
                <div className="bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 rounded-t-lg">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#F58E18] rounded-lg flex items-center justify-center shadow-sm">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {t('customers.table.title')}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('customers.table.description')}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Search Input */}
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder={t('customers.table.searchPlaceholder')}
                                        value={searchTerm}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                        className="pl-10 w-64 bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-800 focus:border-[#F58E18] focus:ring-[#F58E18]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Content */}
                <div className="p-6 rounded-b-2xl">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                            <span className="ml-3 text-gray-600 dark:text-gray-400">
                                {t('customers.table.loading')}
                            </span>
                        </div>
                    ) : (
                        <>
                            {/* Table */}
                            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-white dark:bg-[#1a1a1a]">
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4" />
                                                    {t('customers.table.name')}
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    {t('customers.table.email')}
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    {t('customers.table.phone')}
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <UserCheck className="w-4 h-4" />
                                                    {t('customers.table.username')}
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <UserCheck className="w-4 h-4" />
                                                    {t('customers.table.role')}
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {t('customers.table.createdAt')}
                                                </div>
                                            </TableHead>
                                            <TableHead className="w-32">
                                                {t('customers.table.actions')}
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedCustomers.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-12">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <User className="w-12 h-12 text-gray-400" />
                                                        <p className="text-gray-500 dark:text-gray-400">
                                                            {t('customers.table.noCustomers')}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedCustomers.map((customer) => (
                                                <TableRow
                                                    key={customer.id}
                                                    className="hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors"
                                                >
                                                    <TableCell className="font-medium">
                                                        {customer.name}
                                                    </TableCell>
                                                    <TableCell className="text-gray-600 dark:text-gray-400">
                                                        {customer.email || '-'}
                                                    </TableCell>
                                                    <TableCell className="text-gray-600 dark:text-gray-400">
                                                        {customer.phone || '-'}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-sm">
                                                        {customer.username || '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {customer.role ? formatRole(customer.role) : '-'}
                                                    </TableCell>
                                                    <TableCell className="text-gray-500 dark:text-gray-400">
                                                        {formatDate(customer.created_at)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {onEdit && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => onEdit(customer)}
                                                                    className="h-8 w-8 p-0 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                                >
                                                                    <Edit className="w-4 h-4 text-green-600" />
                                                                </Button>
                                                            )}
                                                            {onViewTransactions && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => onViewTransactions(customer)}
                                                                    className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                                    title={t('customers.table.viewTransactions')}
                                                                >
                                                                    <Receipt className="w-4 h-4 text-blue-600" />
                                                                </Button>
                                                            )}
                                                            {onPrintReceipt && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => onPrintReceipt(customer)}
                                                                    className="h-8 w-8 p-0 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                                                    title={t('customers.table.printReceipt')}
                                                                >
                                                                    <Printer className="w-4 h-4 text-purple-600" />
                                                                </Button>
                                                            )}
                                                            {onDelete && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => onDelete(customer)}
                                                                    className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                >
                                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between mt-6">
                                <div className="flex items-center gap-4">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('customers.table.showing')} {startIndex + 1} {t('customers.table.to')} {Math.min(endIndex, externalPagination ? pagination.totalItems : customers.length)} {t('customers.table.of')} {externalPagination ? pagination.totalItems : customers.length} {t('customers.table.entries')}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(1)}
                                        disabled={pagination.currentPage === 1}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronsLeft className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        disabled={pagination.currentPage === 1}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                            const page = i + 1;
                                            return (
                                                <Button
                                                    key={page}
                                                    variant={pagination.currentPage === page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(page)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    {page}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                    
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        disabled={pagination.currentPage === pagination.totalPages}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(pagination.totalPages)}
                                        disabled={pagination.currentPage === pagination.totalPages}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronsRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
});

export default CustomerTable;
