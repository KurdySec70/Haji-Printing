import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Package, X, DollarSign, Tag, Ruler, ChevronDown, Hash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { formatIQD, parseIQD } from '@/lib/currency';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/utils/apiClient';

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

interface AddProductModalProps {
    onProductAdded?: (product: Product) => void;
    onProductUpdated?: (product: Product) => void;
    product?: Product | null; // For edit mode
    isEditMode?: boolean;
}

export default function AddProductModal({ 
    onProductAdded, 
    onProductUpdated, 
    product = null, 
    isEditMode = false
}: AddProductModalProps) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    
    // Use only manual state management - no Inertia useForm at all
    const [data, setData] = useState({
        name: '',
        price: '',
        type: '',
        width: '',
        height: ''
    });

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const reset = () => {
        setData({ name: '', price: '', type: '', width: '', height: '' });
        setErrors({});
    };
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const typeOptions = [
        { value: 'pcs', label: t('products.modal.addProduct.form.typeOptions.pcs') },
        { value: 'kg', label: t('products.modal.addProduct.form.typeOptions.kg') },
        { value: 'width*height', label: t('products.modal.addProduct.form.typeOptions.widthHeight') }
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
        if (isEditMode && product) {
            setData({
                name: product.name || '',
                price: product.price ? product.price.toString() : '',
                type: product.type || '',
                width: product.width ? product.width.toString().replace(' cm', '') : '',
                height: product.height ? product.height.toString().replace(' cm', '') : ''
            });
            setIsOpen(true);
        }
    }, [isEditMode, product]);

    const handleInputChange = (field: string, value: string) => {
        if (field === 'price') {
            // For price field, store the raw numeric value without formatting
            const numericValue = parseIQD(value);
            setData(prev => ({ ...prev, price: numericValue.toString() }));
        } else {
            setData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleTypeSelect = (value: string) => {
        setData(prev => ({
            ...prev,
            type: value,
            width: value !== 'width*height' ? '' : prev.width,
            height: value !== 'width*height' ? '' : prev.height
        }));
        setIsDropdownOpen(false);
    };

    const handleSubmit = async () => {
        setProcessing(true);
        setErrors({});

        // Determine the correct endpoint based on current URL
        const currentPath = window.location.pathname;
        const endpoint = currentPath.includes('/cashier/') ? '/cashier/products' : '/admin/products';

        const parsedPrice = Number.parseFloat(data.price);
        const parsedWidth = data.type === 'width*height' && data.width ? Number.parseFloat(data.width) : null;
        const parsedHeight = data.type === 'width*height' && data.height ? Number.parseFloat(data.height) : null;

        const normalizedPrice = Number.isFinite(parsedPrice) ? parsedPrice : null;
        const normalizedWidth = parsedWidth !== null && Number.isFinite(parsedWidth) ? parsedWidth : null;
        const normalizedHeight = parsedHeight !== null && Number.isFinite(parsedHeight) ? parsedHeight : null;

        const requestPayload = {
            name: data.name.trim(),
            price: normalizedPrice,
            type: data.type,
            width: data.type === 'width*height' ? normalizedWidth : null,
            height: data.type === 'width*height' ? normalizedHeight : null,
        };

        try {
            const isEditing = Boolean(isEditMode && product);
            const url = isEditing && product ? `${endpoint}/${product.id}` : endpoint;
            const response = isEditing
                ? await api.put(url, requestPayload)
                : await api.post(url, requestPayload);

            if (!response.data?.success) {
                throw new Error(response.data?.message || 'Operation failed');
            }

            const mergedProduct = {
                ...(product ?? {}),
                ...requestPayload,
                ...(response.data.product || {}),
            };

            const savedProduct: Product = {
                ...mergedProduct,
                price: Number(mergedProduct.price ?? 0),
                width: mergedProduct.width ?? undefined,
                height: mergedProduct.height ?? undefined,
            } as Product;

            reset();
            setIsOpen(false);

            if (isEditing) {
                onProductUpdated?.(savedProduct);
                toast({
                    title: t('toast.success'),
                    description: t('toast.productUpdated'),
                    variant: 'success',
                });
            } else {
                onProductAdded?.(savedProduct);
                toast({
                    title: t('toast.success'),
                    description: t('toast.productCreated'),
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
                console.error('Product save failed:', error);
            }
            toast({
                title: t('toast.error'),
                description: isEditMode ? t('toast.failedToUpdate') : t('toast.failedToCreate'),
                variant: "destructive",
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            {/* Trigger Button - Only show for add mode */}
            {!isEditMode && (
                <Button 
                    onClick={() => setIsOpen(true)}
                    variant="green"
                    className="px-6 py-4 text-base font-medium"
                >
                                <Plus className="w-5 h-5 mr-2" />
                    {t('common.buttons.add')} {t('products.title')}
                </Button>
            )}

            {/* Custom Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Modal */}
                    <div className="relative bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl border border-gray-200 dark:border-0 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#F58E18] purple-600 rounded-lg flex items-center justify-center">
                                    <Package className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {isEditMode ? t('products.modal.editProduct.title') : t('products.modal.addProduct.title')}
                                    </h2>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-[#262626] rounded-lg transition-colors"
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
                                {/* Product Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Hash className="w-4 h-4" />
                                        {t('products.modal.addProduct.form.name')} *
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder={t('products.modal.addProduct.form.namePlaceholder')}
                                        value={data.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        required
                                        className={`w-full ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        {t('products.modal.addProduct.form.price')} *
                                    </Label>
                                    <Input
                                        id="price"
                                        type="text"
                                        placeholder={t('products.modal.addProduct.form.pricePlaceholder')}
                                        value={data.price ? formatIQD(data.price) : ''}
                                        onChange={(e) => handleInputChange('price', e.target.value)}
                                        required
                                        className={`w-full ${errors.price ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                    {errors.price && (
                                        <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                                    )}
                                </div>

                                {/* Type Dropdown */}
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="type" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Tag className="w-4 h-4" />
                                        {t('products.modal.addProduct.form.type')} *
                                    </Label>
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className={`w-full h-10 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-[#431407] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 px-3 py-2 text-left flex items-center justify-between cursor-pointer ${errors.type ? 'border-red-500 focus:border-red-500' : ''}`}
                                        >
                                            <span className={data.type ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                                                {data.type ? typeOptions.find(opt => opt.value === data.type)?.label : t('products.modal.addProduct.form.typePlaceholder')}
                                            </span>
                                            <ChevronDown 
                                                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                                    isDropdownOpen ? 'rotate-180' : ''
                                                }`} 
                                            />
                                        </button>
                                        
                                        {isDropdownOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-[10000] overflow-hidden">
                                                {typeOptions.map((option) => (
                                                    <button
                                                        key={option.value}
                                                        type="button"
                                                        onClick={() => handleTypeSelect(option.value)}
                                                        className="w-full px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-[#262626] focus:bg-blue-50 dark:focus:bg-[#431407] hover:text-blue-700 dark:hover:text-[#fed7aa] focus:text-blue-700 dark:focus:text-[#fed7aa] transition-all duration-200 text-gray-900 dark:text-[#fed7aa] cursor-pointer"
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {errors.type && (
                                        <p className="text-red-500 text-xs mt-1">{errors.type}</p>
                                    )}
                                </div>

                                {/* Width and Height - Always shown but disabled when not width*height type */}
                                <div className="space-y-2">
                                    <Label htmlFor="width" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Ruler className="w-4 h-4" />
                                        {t('products.modal.addProduct.form.width')} {data.type === 'width*height' && '*'}
                                    </Label>
                                    <Input
                                        id="width"
                                        type="number"
                                        placeholder={data.type === 'width*height' ? t('products.modal.addProduct.form.widthPlaceholder') : t('products.modal.addProduct.form.selectWidthHeightFirst')}
                                        value={data.width}
                                        onChange={(e) => handleInputChange('width', e.target.value)}
                                        disabled={data.type !== 'width*height'}
                                        required={data.type === 'width*height'}
                                        className={`w-full ${data.type !== 'width*height' ? 'bg-gray-100 dark:bg-[#262626] text-gray-400 dark:text-gray-500 cursor-not-allowed' : ''} ${errors.width ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                    {errors.width && (
                                        <p className="text-red-500 text-xs mt-1">{errors.width}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="height" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Ruler className="w-4 h-4" />
                                        {t('products.modal.addProduct.form.height')} {data.type === 'width*height' && '*'}
                                    </Label>
                                    <Input
                                        id="height"
                                        type="number"
                                        placeholder={data.type === 'width*height' ? t('products.modal.addProduct.form.heightPlaceholder') : t('products.modal.addProduct.form.selectWidthHeightFirst')}
                                        value={data.height}
                                        onChange={(e) => handleInputChange('height', e.target.value)}
                                        disabled={data.type !== 'width*height'}
                                        required={data.type === 'width*height'}
                                        className={`w-full ${data.type !== 'width*height' ? 'bg-gray-100 dark:bg-[#262626] text-gray-400 dark:text-gray-500 cursor-not-allowed' : ''} ${errors.height ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                    {errors.height && (
                                        <p className="text-red-500 text-xs mt-1">{errors.height}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                className="px-6 py-2"
                                disabled={processing}
                            >
                                {t('products.modal.addProduct.buttons.cancel')}
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                className="bg-green-600 text-white px-6 py-2"
                                disabled={processing}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                {processing 
                                    ? (isEditMode ? t('common.updating') : t('common.creating')) 
                                    : (isEditMode ? t('products.modal.editProduct.buttons.updateProduct') : t('products.modal.addProduct.buttons.addProduct'))
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
