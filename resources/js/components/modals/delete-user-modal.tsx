// Removed unused import
import { Button } from '@/components/ui/button';
import { Trash2, X, AlertTriangle, User, Shield, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm } from '@inertiajs/react';
import { useToast } from '@/hooks/use-toast';

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

interface DeleteUserModalProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    onUserDeleted?: (user: User) => void;
}

export default function DeleteUserModal({
    user,
    isOpen,
    onClose,
    onUserDeleted
}: DeleteUserModalProps) {
    const { t } = useTranslation();
    const { toast } = useToast();
    
    const { delete: deleteUser, processing, errors } = useForm();

    if (!user || !isOpen) return null;

    // Check admin deletion scenarios
    const isAdmin = user.role === 'admin';
    const isFirstAdmin = user.id === 1 && user.role === 'admin';
    // Note: We can't easily check if this is the last admin from frontend
    // The backend will handle this validation

    const handleDelete = () => {
        deleteUser(`/admin/users/${user.id}`, {
            onSuccess: () => {
                onClose();
                onUserDeleted?.(user);
                toast({
                    title: t('toast.success'),
                    description: t('toast.userDeleted'),
                    variant: "success",
                });
            },
            onError: () => {
                toast({
                    title: t('toast.error'),
                    description: t('toast.failedToDeleteUser'),
                    variant: "destructive",
                });
            }
        });
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin':
                return <Shield className="w-4 h-4 text-white" />;
            case 'cashier':
                return <UserCheck className="w-4 h-4 text-white" />;
            default:
                return <User className="w-4 h-4 text-white" />;
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'from-purple-500 to-purple-600';
            case 'cashier':
                return 'from-blue-500 to-blue-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
            case 'cashier':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-[#262626]/50 dark:text-gray-300';
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl border border-gray-200 dark:border-0 max-w-md w-full mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F58E18] red-600 rounded-lg flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {t('users.modal.deleteUser.title')}
                            </h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Warning Icon and Message */}
                    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="space-y-2">
                            <p className="text-red-800 dark:text-red-300 font-medium">
                                {t('users.modal.deleteUser.warning')}
                            </p>
                            <p className="text-red-700 dark:text-red-400 text-sm">
                                {t('users.modal.deleteUser.description')}
                            </p>
                            {isFirstAdmin && (
                                <p className="text-red-700 dark:text-red-400 text-sm font-semibold">
                                    {t('users.modal.deleteUser.firstAdminWarning')}
                                </p>
                            )}
                            {isAdmin && !isFirstAdmin && (
                                <p className="text-red-700 dark:text-red-400 text-sm font-semibold">
                                    {t('users.modal.deleteUser.adminWarning')}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* User Information */}
                    <div className="p-4 bg-gray-50 dark:bg-[#262626]/50 rounded-lg border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-8 h-8 bg-gradient-to-br ${getRoleColor(user.role)} rounded-lg flex items-center justify-center`}>
                                {getRoleIcon(user.role)}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {user.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    ID: #{user.id}
                                </p>
                            </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {user.email}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Username:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {user.username}
                                </span>
                            </div>
                            {user.phone && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {user.phone}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Role:</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                    {t(`users.modal.addUser.form.roleOptions.${user.role}`)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* General Error Display */}
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                            <p className="text-red-700 dark:text-red-300 text-sm">
                                {Object.values(errors).join(', ')}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-800">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="px-6 py-2 border-gray-300 dark:border-gray-800 text-gray-700 dark:text-gray-300 transition-all duration-300 ease-out hover:scale-105 hover:shadow-md transform"
                        disabled={processing}
                    >
                        {t('users.modal.deleteUser.buttons.cancel')}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleDelete}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg transform group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        disabled={processing || isFirstAdmin}
                    >
                        <Trash2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300 ease-out" />
                        {processing ? t('users.modal.deleteUser.buttons.deleting') : t('users.modal.deleteUser.buttons.delete')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
