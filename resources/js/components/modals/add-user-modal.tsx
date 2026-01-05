import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, User, X, Mail, UserCheck, Phone, Lock, ChevronDown, Hash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm } from '@inertiajs/react';
import { useToast } from '@/hooks/use-toast';

interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    phone?: string;
    role: string;
    created_at: string;
    updated_at: string;
}

interface AddUserModalProps {
    onUserAdded?: (user: User) => void;
    onUserUpdated?: (user: User) => void;
    user?: User | null; // For edit mode
    isEditMode?: boolean;
    isOpen?: boolean; // External control for modal state
    onClose?: () => void; // External close handler
}

export default function AddUserModal({ 
    onUserAdded, 
    onUserUpdated, 
    user = null, 
    isEditMode = false,
    isOpen: externalIsOpen,
    onClose: externalOnClose
}: AddUserModalProps) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    
    // Use external state if provided, otherwise use internal state
    const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
    const setIsOpen = externalOnClose ? externalOnClose : setInternalIsOpen;
    
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        username: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role: 'cashier'
    });
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const roleOptions = [
        { value: 'cashier', label: t('users.modal.addUser.form.roleOptions.cashier') },
        { value: 'admin', label: t('users.modal.addUser.form.roleOptions.admin') }
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Populate form when in edit mode
    useEffect(() => {
        if (isEditMode && user) {
            setData({
                name: user.name || '',
                email: user.email || '',
                username: user.username || '',
                phone: user.phone ? user.phone.replace(/^\+964/, '') : '',
                password: '',
                password_confirmation: '',
                role: user.role || 'customer'
            });
            setIsOpen(true);
        }
    }, [isEditMode, user, setData, setIsOpen]);

    const handleInputChange = (field: string, value: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setData(field as any, value);
    };

    const handleRoleSelect = (value: string) => {
        setData('role', value);
        setIsDropdownOpen(false);
    };

    const handleSubmit = () => {
        // Transform phone number to include +964 prefix
        const phoneWithPrefix = data.phone ? `+964${data.phone}` : '';
        // Transform phone number to include +964 prefix

        // Temporarily update form data for submission
        setData('phone', phoneWithPrefix);

        if (isEditMode && user) {
            // Edit mode - use PUT request
            put(`/admin/users/${user.id}`, {
                onSuccess: () => {
                    reset();
                    if (externalOnClose) {
                        externalOnClose();
                    } else {
                        setInternalIsOpen(false);
                    }
                    // Get the updated user from the response
                    const updatedUser = user;
                    onUserUpdated?.(updatedUser);
                    toast({
                        title: t('toast.success'),
                        description: t('toast.userUpdated'),
                        variant: "success",
                    });
                },
                onError: () => {
                    
                    toast({
                        title: t('toast.error'),
                        description: t('toast.failedToUpdateUser'),
                        variant: "destructive",
                    });
                }
            });
        } else {
            // Add mode - use POST request
            post('/admin/users', {
                onSuccess: () => {
                    reset();
                    if (externalOnClose) {
                        externalOnClose();
                    } else {
                        setInternalIsOpen(false);
                    }
                    // Get the new user from the response
                    const newUser = { 
                        id: Date.now(), 
                        ...data,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    };
                    onUserAdded?.(newUser);
                    toast({
                        title: t('toast.success'),
                        description: t('toast.userCreated'),
                        variant: "success",
                    });
                },
                onError: () => {
                    
                    toast({
                        title: t('toast.error'),
                        description: t('toast.failedToCreateUser'),
                        variant: "destructive",
                    });
                }
            });
        }
    };

    return (
        <>
            {/* Trigger Button - Only show for add mode and when not externally controlled */}
            {!isEditMode && externalIsOpen === undefined && (
                <Button 
                    onClick={() => setInternalIsOpen(true)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 rounded-xl px-6 py-4 text-base font-medium transition-all duration-500 ease-out shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transform group"
                >
                    <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-500 ease-out" />
                    {t('common.buttons.add')} {t('common.navigation.users')}
                </Button>
            )}

            {/* Custom Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => {
                            if (externalOnClose) {
                                externalOnClose();
                            } else {
                                setInternalIsOpen(false);
                            }
                        }}
                    />
                    
                    {/* Modal */}
                    <div className="relative bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl border border-gray-200 dark:border-0 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#F58E18] purple-600 rounded-lg flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {isEditMode ? t('users.modal.editUser.title') : t('users.modal.addUser.title')}
                                    </h2>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    if (externalOnClose) {
                                        externalOnClose();
                                    } else {
                                        setInternalIsOpen(false);
                                    }
                                }}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-4">
                            {/* General Error Display */}
                            {Object.keys(errors).length > 0 && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                    <p className="text-red-700 dark:text-red-300 text-sm">
                                        {Object.values(errors).join(', ')}
                                    </p>
                                </div>
                            )}

                            {/* Form Fields - Responsive Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Full Name */}
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        {t('users.modal.addUser.form.name')} *
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder={t('users.modal.addUser.form.namePlaceholder')}
                                        value={data.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        required
                                        className={`w-full ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        {t('users.modal.addUser.form.email')} *
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder={t('users.modal.addUser.form.emailPlaceholder')}
                                        value={data.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        required
                                        className={`w-full ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                    )}
                                </div>

                                {/* Username */}
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Hash className="w-4 h-4" />
                                        {t('users.modal.addUser.form.username')} *
                                    </Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder={t('users.modal.addUser.form.usernamePlaceholder')}
                                        value={data.username}
                                        onChange={(e) => handleInputChange('username', e.target.value)}
                                        required
                                        className={`w-full ${errors.username ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                    {errors.username && (
                                        <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        {t('users.modal.addUser.form.phone')}
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="7XX XXX XXXX"
                                        value={data.phone}
                                        onChange={(e) => {
                                            // Only allow numbers and limit to reasonable length
                                            const value = e.target.value.replace(/[^\d]/g, '');
                                            if (value.length <= 10) {
                                                handleInputChange('phone', value);
                                            }
                                        }}
                                        className={`w-full ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                    )}
                                </div>

                                {/* Role Dropdown */}
                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <UserCheck className="w-4 h-4" />
                                        {t('users.modal.addUser.form.role')} *
                                    </Label>
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className={`w-full h-10 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-[#431407] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 px-3 py-2 text-left flex items-center justify-between cursor-pointer ${errors.role ? 'border-red-500 focus:border-red-500' : ''}`}
                                        >
                                            <span className={data.role ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                                                {data.role ? roleOptions.find(opt => opt.value === data.role)?.label : t('users.modal.addUser.form.rolePlaceholder')}
                                            </span>
                                            <ChevronDown 
                                                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                                    isDropdownOpen ? 'rotate-180' : ''
                                                }`} 
                                            />
                                        </button>
                                        
                                        {isDropdownOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-[10000] overflow-hidden">
                                                {roleOptions.map((option) => (
                                                    <button
                                                        key={option.value}
                                                        type="button"
                                                        onClick={() => handleRoleSelect(option.value)}
                                                        className="w-full px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 focus:text-blue-700 dark:focus:text-blue-300 transition-all duration-200 text-gray-900 dark:text-white cursor-pointer"
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {errors.role && (
                                        <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        {t('users.modal.addUser.form.password')} {!isEditMode && '*'}
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder={isEditMode ? t('users.modal.addUser.form.passwordPlaceholderEdit') : t('users.modal.addUser.form.passwordPlaceholder')}
                                        value={data.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        required={!isEditMode}
                                        className={`w-full ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                    )}
                                </div>

                                {/* Password Confirmation */}
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        {t('users.modal.addUser.form.passwordConfirmation')} {!isEditMode && '*'}
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        placeholder={t('users.modal.addUser.form.passwordConfirmationPlaceholder')}
                                        value={data.password_confirmation}
                                        onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                                        required={!isEditMode}
                                        className={`w-full ${errors.password_confirmation ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-800">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    if (externalOnClose) {
                                        externalOnClose();
                                    } else {
                                        setInternalIsOpen(false);
                                    }
                                }}
                                className="px-6 py-2 border-gray-300 dark:border-gray-800 text-gray-700 dark:text-gray-300 transition-all duration-300 ease-out hover:scale-105 hover:shadow-md transform"
                                disabled={processing}
                            >
                                {t('users.modal.addUser.buttons.cancel')}
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg transform group"
                                disabled={processing}
                            >
                                <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300 ease-out" />
                                {processing 
                                    ? (isEditMode ? 'Updating...' : 'Adding...') 
                                    : (isEditMode ? t('users.modal.editUser.buttons.updateUser') : t('users.modal.addUser.buttons.addUser'))
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
