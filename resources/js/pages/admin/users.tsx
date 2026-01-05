import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import PageHeader, { PageHeaderActions } from '@/components/page-header';
import { LazyAddUserModal, LazyDeleteUserModal } from '@/components/lazy-imports';
import UserTable from '@/components/tables/user-table';
import RefreshButton from '@/components/buttons/refresh-button';
import GenericExportButton from '@/components/buttons/generic-export-button';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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

interface UsersPageProps {
    users?: User[];
}

export default function Users({ users: initialUsers = [] }: UsersPageProps) {
    const { t } = useTranslation();
    // const { toast } = useToast();
    
    // User data from backend
    const [users, setUsers] = useState<User[]>(initialUsers || []);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // Add modal state
    const [addModalOpen, setAddModalOpen] = useState(false);
    
    // Edit modal state
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    
    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    
    // Update users when props change (after refresh)
    useEffect(() => {
        setUsers(initialUsers || []);
    }, [initialUsers]);
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('common.navigation.users'),
            href: '/admin/users',
        },
    ];

    const handleAddUser = () => {
        setAddModalOpen(true);
    };
    
    const handleUserAdded = (user: User) => {
        setUsers(prev => [...prev, user]);
        setAddModalOpen(false);
        // Refresh the page to get updated data
        router.reload();
    };
    
    const handleCloseAddModal = () => {
        setAddModalOpen(false);
    };
    
    const handleEditUser = (user: User) => {
        setUserToEdit(user);
        setEditModalOpen(true);
    };
    
    const handleUserUpdated = (updatedUser: User | null) => {
        if (updatedUser) {
            // User was successfully updated
            setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
            // Refresh the page to get updated data
            router.reload();
        }
        // Close modal regardless of whether update was successful or cancelled
        setEditModalOpen(false);
        setUserToEdit(null);
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

    const handleDeleteUser = (user: User) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const handleUserDeleted = (deletedUser: User) => {
        // Remove user from local state
        setUsers(prevUsers => prevUsers.filter(u => u.id !== deletedUser.id));
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setUserToDelete(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('common.navigation.users')} - ${t('app.name')}`} />
            
            <div className="flex flex-1 flex-col gap-6 p-6 min-h-screen bg-white dark:bg-[#0a0a0a]">
                {/* Page Header Component */}
                <PageHeader
                    title={t('common.navigation.users')}
                    variant="elevated"
                    size="lg"
                    actions={
                        <PageHeaderActions>
                            <RefreshButton onRefresh={handleRefresh} />
                            <GenericExportButton 
                                data={users}
                                filename={`users_export_${new Date().toISOString().split('T')[0]}.csv`}
                                headers={[
                                    'ID',
                                    'Name',
                                    'Email',
                                    'Username',
                                    'Phone',
                                    'Role',
                                    'Created At'
                                ]}
                                getRowData={(user) => [
                                    user.id.toString(),
                                    user.name,
                                    user.email,
                                    user.username,
                                    user.phone || '',
                                    user.role,
                                    new Date(user.created_at).toLocaleDateString()
                                ]}
                                emptyMessage={t('export.noUsers')}
                                successMessage={t('export.usersExportedSuccessfully')}
                            />
                            <Button
                                onClick={handleAddUser}
                                variant="default"
                                className="px-6 py-4 text-base font-medium flex items-center gap-2 bg-[#F58E18] hover:bg-[#EA580C]"
                            >
                                <Plus className="w-5 h-5" />
                                {t('users.modal.addUser.buttons.addUser')}
                            </Button>
                        </PageHeaderActions>
                    }
                />

                {/* User Table */}
                <div className="flex-1">
                    <UserTable
                        users={users}
                        loading={isRefreshing}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteUser}
                        sortBy="name"
                        sortOrder="asc"
                        className="h-full"
                    />
                </div>
                
                {/* Add User Modal */}
                <LazyAddUserModal
                    isOpen={addModalOpen}
                    onClose={handleCloseAddModal}
                    onUserAdded={handleUserAdded}
                />
                
                {/* Edit User Modal */}
                {editModalOpen && userToEdit && (
                    <LazyAddUserModal
                        user={userToEdit}
                        isEditMode={true}
                        onUserUpdated={handleUserUpdated}
                        onUserAdded={handleUserAdded}
                    />
                )}
                
                {/* Delete User Modal */}
                <LazyDeleteUserModal
                    user={userToDelete}
                    isOpen={deleteModalOpen}
                    onClose={handleCloseDeleteModal}
                    onUserDeleted={handleUserDeleted}
                />
            </div>
        </AppLayout>
    );
}
