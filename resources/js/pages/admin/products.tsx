import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import PageHeader, { PageHeaderActions } from '@/components/page-header';
import { LazyAddProductModal, LazyViewProductModal, LazyDeleteProductModal } from '@/components/lazy-imports';
import ProductFilters from '@/components/filters/product-filters';
import ProductTable from '@/components/tables/product-table';
import ExportButton from '@/components/buttons/export-button';
import RefreshButton from '@/components/buttons/refresh-button';

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

interface FilterState {
    search: string;
    type: string;
    priceMin: string;
    priceMax: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface ProductsPageProps {
    products: PaginatedProducts;
    filters?: FilterState;
}

export default function Products({ products: initialProducts, filters: initialFilters }: ProductsPageProps) {
    const { t } = useTranslation();

    // State management
    const [products, setProducts] = useState<Product[]>(initialProducts?.data || []);
    const [pagination, setPagination] = useState({
        currentPage: initialProducts?.current_page || 1,
        lastPage: initialProducts?.last_page || 1,
        perPage: initialProducts?.per_page || 10,
        total: initialProducts?.total || 0
    });
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<FilterState>(initialFilters || {
        search: '',
        type: '',
        priceMin: '',
        priceMax: '',
        sortBy: 'name',
        sortOrder: 'asc'
    });
    
    // View modal state
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    
    // Edit modal state
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    
    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    
    // Update products when props change
    useEffect(() => {
        setProducts(initialProducts?.data || []);
        setPagination({
            currentPage: initialProducts?.current_page || 1,
            lastPage: initialProducts?.last_page || 1,
            perPage: initialProducts?.per_page || 10,
            total: initialProducts?.total || 0
        });
    }, [initialProducts]);
    
    const handleFiltersChange = (newFilters: FilterState) => {
        setFilters(newFilters);
        setLoading(true);
        
        // Make API call with filters
        router.get('/admin/products', {
            search: newFilters.search,
            type: newFilters.type,
            price_min: newFilters.priceMin,
            price_max: newFilters.priceMax,
            sort_by: newFilters.sortBy,
            sort_order: newFilters.sortOrder
        }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setLoading(false)
        });
    };
    
    const handleProductAdded = (product: Product) => {
        setProducts(prev => [product, ...prev]);
        // Refresh the page to get updated data
        router.reload();
    };
    
    
    
    const handleViewProduct = (product: Product) => {
        setSelectedProduct(product);
        setViewModalOpen(true);
    };
    
    const handleCloseViewModal = () => {
        setViewModalOpen(false);
        setSelectedProduct(null);
    };
    
    const handleEditProduct = (product: Product) => {
        setProductToEdit(product);
        setEditModalOpen(true);
    };
    
    const handleProductUpdated = (updatedProduct: Product) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        setEditModalOpen(false);
        setProductToEdit(null);
        // Refresh the page to get updated data
        router.reload();
    };
    
    
    
    
    const handleDeleteProduct = (product: Product) => {
        setProductToDelete(product);
        setDeleteModalOpen(true);
    };
    
    const handleProductDeleted = (deletedProduct: Product) => {
        setProducts(prev => prev.filter(p => p.id !== deletedProduct.id));
        setDeleteModalOpen(false);
        setProductToDelete(null);
        // Refresh the page to get updated data
        router.reload();
    };
    
    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setProductToDelete(null);
    };
    
    const handleRefresh = () => {
        setLoading(true);
        router.reload({
            onFinish: () => setLoading(false)
        });
    };
    
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('products.title'),
            href: '/admin/products',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('products.title')} - ${t('app.name')}`} />

            <div className="flex flex-1 flex-col gap-6 p-6 min-h-screen bg-white dark:bg-[#0a0a0a]">
                {/* Page Header Component */}
                <PageHeader
                    title={t('products.title')}
                    variant="elevated"
                    size="lg"
                    actions={
                        <PageHeaderActions>
                            <RefreshButton onRefresh={handleRefresh} />
                            <ExportButton 
                                products={products}
                                filename={`products_export_${new Date().toISOString().split('T')[0]}.csv`}
                            />
                            <LazyAddProductModal onProductAdded={handleProductAdded} />
                        </PageHeaderActions>
                    }
                />

                {/* Filter Component */}
                <ProductFilters
                    onFiltersChange={handleFiltersChange}
                />

                {/* Product Table Component */}
                <ProductTable
                    products={products}
                    loading={loading}
                    onEdit={handleEditProduct}
                    onView={handleViewProduct}
                    onDelete={handleDeleteProduct}
                    sortBy={filters.sortBy}
                    sortOrder={filters.sortOrder}
                    pagination={pagination}
                />
                
                {/* View Product Modal */}
                <LazyViewProductModal
                    product={selectedProduct}
                    isOpen={viewModalOpen}
                    onClose={handleCloseViewModal}
                />

                {/* Edit Product Modal */}
                <LazyAddProductModal
                    product={productToEdit}
                    isEditMode={editModalOpen}
                    onProductUpdated={handleProductUpdated}
                    onProductAdded={handleProductAdded}
                />

                {/* Delete Product Modal */}
                <LazyDeleteProductModal
                    product={productToDelete}
                    isOpen={deleteModalOpen}
                    onClose={handleCloseDeleteModal}
                    onProductDeleted={handleProductDeleted}
                />
            </div>
        </AppLayout>
    );
}