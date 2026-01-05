import { useState, useEffect, useMemo } from 'react';
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
    Hash
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    username: string;
    role: string;
    created_at: string;
    updated_at: string;
}

interface UserTableProps {
    users: User[];
    loading?: boolean;
    onEdit?: (user: User) => void;
    onDelete?: (user: User) => void;
    className?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

interface PaginationState {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export default function UserTable({
    users = [],
    loading = false,
    onEdit,
    onDelete,
    className = '',
}: UserTableProps) {
    const { t } = useTranslation();
    
    // State management
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState<PaginationState>({
        currentPage: 1,
        pageSize: 25,
        totalItems: users?.length || 0,
        totalPages: Math.ceil((users?.length || 0) / 25)
    });
    
    // Filter users based on search term
    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users || [];
        
        const term = searchTerm.toLowerCase();
        return (users || []).filter(user => 
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            (user.phone && user.phone.toLowerCase().includes(term)) ||
            user.username.toLowerCase().includes(term)
        );
    }, [users, searchTerm]);

    // Update pagination when filtered users change
    useEffect(() => {
        const pageSize = 25; // Fixed page size
        const totalPages = Math.ceil(filteredUsers.length / pageSize);
        setPagination(prev => ({
            ...prev,
            totalItems: filteredUsers.length,
            totalPages,
            currentPage: prev.currentPage > totalPages ? 1 : prev.currentPage // Only reset if current page is invalid
        }));
    }, [filteredUsers.length]);

    // Get paginated users (already sorted by parent component)
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // Handle pagination
    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    // Format role display
    const formatRole = (role: string) => {
        const roleColors = {
            admin: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
            cashier: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
        };
        
        const roleLabels = {
            admin: t('users.modal.addUser.form.roleOptions.admin'),
            cashier: t('users.modal.addUser.form.roleOptions.cashier')
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
        <div className={cn("w-full relative z-10", className)}>
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
                                        {t('users.table.title')}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('users.table.description')}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Search Input */}
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder={t('users.table.searchPlaceholder')}
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
                                {t('users.table.loading')}
                            </span>
                        </div>
                    ) : (
                        <>
                            {/* Table */}
                            <div className="border border-gray-200 dark:border-[#431407] rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-white dark:bg-[#1a1a1a]">
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4" />
                                                    {t('users.table.name')}
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    {t('users.table.email')}
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    {t('users.table.phone')}
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <Hash className="w-4 h-4" />
                                                    {t('users.table.username')}
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <UserCheck className="w-4 h-4" />
                                                    {t('users.table.role')}
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {t('users.table.createdAt')}
                                                </div>
                                            </TableHead>
                                            <TableHead className="w-32">
                                                {t('users.table.actions')}
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedUsers.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-12">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <User className="w-12 h-12 text-gray-400" />
                                                        <p className="text-gray-500 dark:text-gray-400">
                                                            {t('users.table.noUsers')}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedUsers.map((user) => (
                                                <TableRow
                                                    key={user.id}
                                                    className="hover:bg-gray-50 dark:hover:bg-[#431407]/50 transition-colors"
                                                >
                                                    <TableCell className="font-medium">
                                                        {user.name}
                                                    </TableCell>
                                                    <TableCell className="text-gray-600 dark:text-gray-400">
                                                        {user.email}
                                                    </TableCell>
                                                    <TableCell className="text-gray-600 dark:text-gray-400">
                                                        {user.phone || '-'}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-sm">
                                                        {user.username}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatRole(user.role)}
                                                    </TableCell>
                                                    <TableCell className="text-gray-500 dark:text-gray-400">
                                                        {formatDate(user.created_at)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {onEdit && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => onEdit(user)}
                                                                    className="h-8 w-8 p-0 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                                >
                                                                    <Edit className="w-4 h-4 text-green-600" />
                                                                </Button>
                                                            )}
                                                            {onDelete && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => onDelete(user)}
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
                                        {t('users.table.showing')} {startIndex + 1} {t('users.table.to')} {Math.min(endIndex, users?.length || 0)} {t('users.table.of')} {users?.length || 0} {t('users.table.entries')}
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
}
