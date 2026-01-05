import { useState, useEffect, useCallback, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, X, Mail, Phone, UserCheck, Lock, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/utils/apiClient';

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

interface CustomerFormState {
    name: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    password_confirmation: string;
}

const createInitialFormState = (): CustomerFormState => ({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    password_confirmation: '',
});

interface AddCustomerModalProps {
    onCustomerAdded?: (customer: Customer) => void;
    onCustomerUpdated?: (customer: Customer | null) => void;
    customer?: Customer | null; // For edit mode
    isEditMode?: boolean;
    isOpen?: boolean; // New prop to control modal visibility
    onClose?: () => void; // New prop for close callback
}

export default function AddCustomerModal({ 
    onCustomerAdded, 
    onCustomerUpdated, 
    customer = null, 
    isEditMode = false,
    isOpen: externalIsOpen = false,
    onClose
}: AddCustomerModalProps) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    // Use external isOpen prop if provided, otherwise use internal state
    const isOpen = externalIsOpen || internalIsOpen;
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [data, setData] = useState<CustomerFormState>(createInitialFormState());
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const resetForm = useCallback(() => {
        setData(createInitialFormState());
        setErrors({});
        setShowPassword(false);
        setShowConfirmPassword(false);
    }, []);

    // Initialize form data when customer prop changes (for edit mode)
    useEffect(() => {
        if (customer && isEditMode) {
            setData({
                name: customer.name || '',
                email: customer.email || '',
                phone: customer.phone ? customer.phone.replace(/^\+964/, '') : '',
                username: customer.username || '',
                password: '',
                password_confirmation: ''
            });
            // Open the modal when in edit mode
            setInternalIsOpen(true);
        } else if (!customer && !isEditMode) {
            resetForm();
        }
    }, [customer, isEditMode, resetForm]);

    const handleInputChange = (field: keyof CustomerFormState, value: string) => {
        setData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const handleClose = () => {
        setInternalIsOpen(false);
        resetForm();
        // Call external onClose callback if provided
        if (onClose) {
            onClose();
        }
        // If in edit mode, notify parent that modal was closed
        if (isEditMode && onCustomerUpdated) {
            // Call with null to indicate modal was closed without saving
            onCustomerUpdated(null);
        }
    };

    const handleSubmit = async () => {
        setProcessing(true);
        setErrors({});

        const currentPath = window.location.pathname;
        const baseEndpoint = currentPath.includes('/cashier/') ? '/cashier/customers' : '/admin/customers';
        const isEditing = Boolean(isEditMode && customer);
        const url = isEditing && customer ? `${baseEndpoint}/${customer.id}` : baseEndpoint;

        const payload: Record<string, unknown> = {
            name: data.name.trim(),
            email: data.email.trim(),
            phone: data.phone ? `+964${data.phone}` : null,
            username: data.username ? data.username.trim() : null,
        };

        if (!isEditing || data.password) {
            payload.password = data.password;
            payload.password_confirmation = data.password_confirmation;
        }

        try {
            const response = isEditing
                ? await api.put(url, payload)
                : await api.post(url, payload);

            if (!response.data?.success) {
                throw new Error(response.data?.message || 'Operation failed');
            }

            const mergedCustomer = {
                ...(customer ?? {}),
                ...(response.data.customer || {}),
            };

            const savedCustomer: Customer = {
                ...mergedCustomer,
                phone: mergedCustomer.phone ?? undefined,
            } as Customer;

            resetForm();
            setInternalIsOpen(false);
            onClose?.();

            if (isEditing) {
                onCustomerUpdated?.(savedCustomer);
                toast({
                    title: t('toast.success'),
                    description: t('toast.customerUpdated'),
                    variant: 'success',
                });
            } else {
                onCustomerAdded?.(savedCustomer);
                toast({
                    title: t('toast.success'),
                    description: t('toast.customerCreated'),
                    variant: 'success',
                });
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response?.status === 422) {
                const validationErrors = error.response.data?.errors ?? {};
                const formattedErrors = Object.fromEntries(
                    Object.entries(validationErrors).map(([key, messages]) => [
                        key,
                        Array.isArray(messages) ? messages[0] : String(messages),
                    ]),
                );
                setErrors(formattedErrors);
            } else {
                console.error('Customer save failed:', error);
            }

            toast({
                title: t('toast.error'),
                description: isEditMode ? t('toast.failedToUpdateCustomer') : t('toast.failedToCreateCustomer'),
                variant: 'destructive',
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            {/* Custom Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleClose}
                    />
                    
                    {/* Modal */}
                    <div className="relative bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {isEditMode ? t('customers.modal.editCustomer.title') : t('customers.modal.addCustomer.title')}
                                    </h2>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
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
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        {t('customers.modal.addCustomer.form.name')} *
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder={t('customers.modal.addCustomer.form.namePlaceholder')}
                                        value={data.name}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
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
                                        {t('customers.modal.addCustomer.form.email')} *
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder={t('customers.modal.addCustomer.form.emailPlaceholder')}
                                        value={data.email}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                                        required
                                        className={`w-full ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        {t('customers.modal.addCustomer.form.phone')} *
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="7XX XXX XXXX"
                                        value={data.phone}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            // Only allow numbers and limit to reasonable length
                                            const value = e.target.value.replace(/[^\d]/g, '');
                                            if (value.length <= 10) {
                                                handleInputChange('phone', value);
                                            }
                                        }}
                                        required
                                        className={`w-full ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                    )}
                                </div>

                                {/* Username */}
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <UserCheck className="w-4 h-4" />
                                        {t('customers.modal.addCustomer.form.username')} *
                                    </Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder={t('customers.modal.addCustomer.form.usernamePlaceholder')}
                                        value={data.username}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('username', e.target.value)}
                                        required
                                        className={`w-full ${errors.username ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                    {errors.username && (
                                        <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        {t('customers.modal.addCustomer.form.password')} *
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder={t('customers.modal.addCustomer.form.passwordPlaceholder')}
                                            value={data.password}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
                                            required
                                            className={`w-full pr-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        {t('customers.modal.addCustomer.form.confirmPassword')} *
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password_confirmation"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder={t('customers.modal.addCustomer.form.confirmPasswordPlaceholder')}
                                            value={data.password_confirmation}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('password_confirmation', e.target.value)}
                                            required
                                            className={`w-full pr-10 ${errors.password_confirmation ? 'border-red-500 focus:border-red-500' : ''}`}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && (
                                        <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-800">
                            <Button
                                variant="outline"
                                onClick={handleClose}
                                disabled={processing}
                                className="border-red-500 text-red-500 hover:bg-red-50 hover:border-red-600 hover:text-red-600 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:border-red-300 dark:hover:text-red-300"
                            >
                                {t('common.buttons.cancel')}
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={processing}
                                variant="default"
                            >
                                {processing ? t('common.buttons.saving') : t('common.buttons.save')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
