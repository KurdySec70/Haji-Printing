import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import PageHeader, { PageHeaderActions } from '@/components/page-header';
import { LazyAddCustomerModal, LazyDeleteCustomerModal, LazyCustomerTransactionsModal } from '@/components/lazy-imports';
import CustomerTable from '@/components/tables/customer-table';
import CustomerExportButton from '@/components/buttons/customer-export-button';
import RefreshButton from '@/components/buttons/refresh-button';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';


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

interface PaginatedCustomers {
    data: Customer[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface CustomersPageProps {
    customers: PaginatedCustomers;
}

export default function Customers({ customers: initialCustomers }: CustomersPageProps) {
    const { t } = useTranslation();

    // Customer data from backend
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers?.data || []);
    const [pagination, setPagination] = useState({
        currentPage: initialCustomers?.current_page || 1,
        lastPage: initialCustomers?.last_page || 1,
        perPage: initialCustomers?.per_page || 25,
        total: initialCustomers?.total || 0
    });
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // Add modal state
    const [addModalOpen, setAddModalOpen] = useState(false);
    
    // Edit modal state
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
    
    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
    
    // Transactions modal state
    const [transactionsModalOpen, setTransactionsModalOpen] = useState(false);
    const [customerForTransactions, setCustomerForTransactions] = useState<Customer | null>(null);
    
    
    // Update customers when props change (after refresh)
    useEffect(() => {
        setCustomers(initialCustomers?.data || []);
        setPagination({
            currentPage: initialCustomers?.current_page || 1,
            lastPage: initialCustomers?.last_page || 1,
            perPage: initialCustomers?.per_page || 25,
            total: initialCustomers?.total || 0
        });
    }, [initialCustomers]);
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('customers.title'),
            href: '/admin/customers',
        },
    ];


    const handleAddCustomer = () => {
        setAddModalOpen(true);
    };
    
    const handleCustomerAdded = (customer: Customer) => {
        setCustomers(prev => [...prev, customer]);
        setAddModalOpen(false);
        // Refresh the page to get updated data
        router.reload();
    };
    
    const handleCloseAddModal = () => {
        setAddModalOpen(false);
    };
    
    const handleEditCustomer = (customer: Customer) => {
        setCustomerToEdit(customer);
        setEditModalOpen(true);
    };
    
    const handleCustomerUpdated = (updatedCustomer: Customer | null) => {
        if (updatedCustomer) {
            // Customer was successfully updated
            setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
            // Refresh the page to get updated data
            router.reload();
        }
        // Close modal regardless of whether update was successful or cancelled
        setEditModalOpen(false);
        setCustomerToEdit(null);
    };
    

    const handleDeleteCustomer = (customer: Customer) => {
        setCustomerToDelete(customer);
        setDeleteModalOpen(true);
    };
    
    const handleCustomerDeleted = (deletedCustomer: Customer) => {
        setCustomers(prev => prev.filter(c => c.id !== deletedCustomer.id));
        setDeleteModalOpen(false);
        setCustomerToDelete(null);
        // Refresh the page to get updated data
        router.reload();
    };
    
    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setCustomerToDelete(null);
    };

    const handleViewTransactions = (customer: Customer) => {
        setCustomerForTransactions(customer);
        setTransactionsModalOpen(true);
    };

    const handleCloseTransactionsModal = () => {
        setTransactionsModalOpen(false);
        setCustomerForTransactions(null);
    };




    const handleRefresh = () => {
        setIsRefreshing(true);
        
        // Reload the entire page with fresh data from backend
        router.reload({
            onFinish: () => {
                setIsRefreshing(false);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('customers.title')} - ${t('app.name')}`} />
            
            <div className="flex flex-1 flex-col gap-6 p-6 min-h-screen bg-white dark:bg-[#0a0a0a]">
                {/* Page Header Component */}
                <PageHeader
                    title={t('customers.title')}
                    variant="elevated"
                    size="lg"
                    actions={
                        <PageHeaderActions>
                            <RefreshButton onRefresh={handleRefresh} />
                            <CustomerExportButton 
                                customers={customers}
                                filename={`customers_export_${new Date().toISOString().split('T')[0]}.csv`}
                            />
                            <Button
                                onClick={handleAddCustomer}
                                variant="blue"
                                className="px-6 py-4 text-base font-medium flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                {t('customers.addCustomer')}
                            </Button>
                        </PageHeaderActions>
                    }
                />

                {/* Customer Table */}
                <div className="flex-1">
                    <CustomerTable
                        customers={customers}
                        loading={isRefreshing}
                        onEdit={handleEditCustomer}
                        onDelete={handleDeleteCustomer}
                        onViewTransactions={handleViewTransactions}
                        pagination={pagination}
                        sortBy="name"
                        sortOrder="asc"
                        className="h-full"
                    />
                </div>
                
                {/* Add Customer Modal */}
                <LazyAddCustomerModal
                    isOpen={addModalOpen}
                    onClose={handleCloseAddModal}
                    onCustomerAdded={handleCustomerAdded}
                />
                
                {/* Edit Customer Modal */}
                {editModalOpen && customerToEdit && (
                    <LazyAddCustomerModal
                        customer={customerToEdit}
                        isEditMode={true}
                        onCustomerUpdated={handleCustomerUpdated}
                        onCustomerAdded={handleCustomerAdded}
                    />
                )}
                
                {/* Delete Customer Modal */}
                <LazyDeleteCustomerModal
                    customer={customerToDelete}
                    isOpen={deleteModalOpen}
                    onClose={handleCloseDeleteModal}
                    onCustomerDeleted={handleCustomerDeleted}
                />

                {/* Customer Transactions Modal */}
                <LazyCustomerTransactionsModal
                    customer={customerForTransactions}
                    isOpen={transactionsModalOpen}
                    onClose={handleCloseTransactionsModal}
                />

            </div>
        </AppLayout>
    );
}
