import { useState, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
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
    Eye,
    Trash2,
    Package,
    DollarSign,
    Tag,
    Calendar,
    RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatIQDWithSymbol } from '@/lib/currency';

interface Product {
    id: number;
    name: string;
    price: number;
    type: string;
    width?: string | number;
    height?: string | number;
    created_at: string;
    updated_at: string;
}

interface PaginationInfo {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
}

interface ProductTableProps {
    products: Product[];
    loading?: boolean;
    onEdit?: (product: Product) => void;
    onView?: (product: Product) => void;
    onDelete?: (product: Product) => void;
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

const ProductTable = memo(function ProductTable({
    products,
    loading = false,
    onEdit,
    onView,
    onDelete,
    className = '',
    sortBy = 'name',
    sortOrder = 'asc',
    pagination: externalPagination
}: ProductTableProps) {
    const { t } = useTranslation();
    
    // Use external pagination if provided, otherwise use local state
    const [localPagination, setLocalPagination] = useState<PaginationState>({
        currentPage: 1,
        pageSize: 10,
        totalItems: products.length,
        totalPages: Math.ceil(products.length / 10)
    });

    const pagination = externalPagination ? {
        currentPage: externalPagination.currentPage,
        pageSize: externalPagination.perPage,
        totalItems: externalPagination.total,
        totalPages: externalPagination.lastPage
    } : localPagination;
    
    // Sorting is now handled by external filters

    // Update local pagination when products change (only if not using external pagination)
    useEffect(() => {
        if (!externalPagination) {
            const totalPages = Math.ceil(products.length / localPagination.pageSize);
            setLocalPagination(prev => ({
                ...prev,
                totalItems: products.length,
                totalPages,
                currentPage: prev.currentPage > totalPages ? 1 : prev.currentPage
            }));
        }
    }, [products, localPagination.pageSize, externalPagination]);

    // Sort products using external sort parameters
    const sortedProducts = [...products].sort((a, b) => {
        const aValue = a[sortBy as keyof Product];
        const bValue = b[sortBy as keyof Product];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'asc' 
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return 0;
    });

    // Get paginated products (only slice if using local pagination)
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;

    const paginatedProducts = externalPagination
        ? sortedProducts  // Data is already paginated from server
        : sortedProducts.slice(startIndex, endIndex);

    // Sorting is now handled by external filters

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



    // Format product type display
    const formatProductType = (product: Product) => {
        if (product.type === 'width*height' && product.width && product.height) {
            return `${product.width} × ${product.height}`;
        }
        return product.type.toUpperCase();
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
                                    <Package className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {t('products.table.title')}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('products.table.description')}
                                    </p>
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
                                {t('products.table.loading')}
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
                                                    <Package className="w-4 h-4" />
                                                    {t('products.table.name')}
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4" />
                                                    {t('products.table.price')}
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <Tag className="w-4 h-4" />
                                                    {t('products.table.type')}
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {t('products.table.createdAt')}
                                                </div>
                                            </TableHead>
                                            <TableHead className="w-32">
                                                {t('products.table.actions')}
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                                   {paginatedProducts.length === 0 ? (
                                                       <TableRow>
                                                           <TableCell colSpan={5} className="text-center py-12">
                                                               <div className="flex flex-col items-center gap-3">
                                                                   <Package className="w-12 h-12 text-gray-400" />
                                                                   <p className="text-gray-500 dark:text-gray-400">
                                                                       {t('products.table.noProducts')}
                                                                   </p>
                                                               </div>
                                                           </TableCell>
                                                       </TableRow>
                                                   ) : (
                                                       paginatedProducts.map((product) => (
                                                           <TableRow
                                                               key={product.id}
                                                               className="hover:bg-gray-50 dark:hover:bg-[#431407]/50 transition-colors"
                                                           >
                                                    <TableCell className="font-medium">
                                                        {product.name}
                                                    </TableCell>
                                                    <TableCell className="font-mono">
                                                        {formatIQDWithSymbol(product.price)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                                            {formatProductType(product)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-gray-500 dark:text-gray-400">
                                                        {formatDate(product.created_at)}
                                                    </TableCell>
                                                               <TableCell>
                                                                   <div className="flex items-center gap-2">
                                                                       {onView && (
                                                                           <Button
                                                                               variant="ghost"
                                                                               size="sm"
                                                                               onClick={() => onView(product)}
                                                                               className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-[#431407]"
                                                                           >
                                                                               <Eye className="w-4 h-4 text-blue-600" />
                                                                           </Button>
                                                                       )}
                                                                       {onEdit && (
                                                                           <Button
                                                                               variant="ghost"
                                                                               size="sm"
                                                                               onClick={() => onEdit(product)}
                                                                               className="h-8 w-8 p-0 hover:bg-green-50 dark:hover:bg-[#431407]"
                                                                           >
                                                                               <Edit className="w-4 h-4 text-green-600" />
                                                                           </Button>
                                                                       )}
                                                                       {onDelete && (
                                                                           <Button
                                                                               variant="ghost"
                                                                               size="sm"
                                                                               onClick={() => onDelete(product)}
                                                                               className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-[#431407]"
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
                                        {t('products.table.showing')} {startIndex + 1} {t('products.table.to')} {Math.min(endIndex, externalPagination ? pagination.totalItems : sortedProducts.length)} {t('products.table.of')} {externalPagination ? pagination.totalItems : sortedProducts.length} {t('products.table.entries')}
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

export default ProductTable;
