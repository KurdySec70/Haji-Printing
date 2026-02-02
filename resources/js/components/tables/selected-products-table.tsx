import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Package, Search, User, Check } from 'lucide-react';
import { formatIQDWithSymbol } from '@/lib/currency';
import { LazyCalculatorModal } from '@/components/lazy-imports';
import CustomerSearchDropdown from '@/components/search/customer-search-dropdown';
import ProductSearchDropdown from '@/components/search/product-search-dropdown';
import { calculateProductTotal } from '@/lib/pricing-service';
import { Customer } from '@/types';

interface Product {
    id: number;
    name: string;
    price: number;
    type: 'pcs' | 'kg' | 'width*height';
    width?: string | number;
    height?: string | number;
    quantity: number;
    manualWidth?: number;
    manualHeight?: number;
    manualWeight?: number;
    discount?: number;
    baseWidth?: number;
    baseHeight?: number;
    dimensionsAccepted?: boolean; // New flag for accepted dimensions
    customPrice?: number; // Manual price override for this transaction only
    created_at: string;
    updated_at: string;
    cartItemId?: string; // Unique per cart line
}



interface SelectedProductsTableProps {
    products: Product[];
    onRemoveProduct: (cartItemId: string) => void;
    onUpdateQuantity?: (cartItemId: string, quantity: number) => void;
    onUpdateDimensions?: (cartItemId: string, width: string | number, height: string | number, weight?: string | number) => void;
    onAcceptDimensions?: (cartItemId: string) => void; // New function for accepting dimensions
    onProductDiscountChange?: (cartItemId: string, discount: number) => void; // New function for product discount changes
    onUpdatePrice?: (cartItemId: string, customPrice: number | undefined) => void; // New function for price override
    onClearCart?: () => void;
    onCheckout?: () => void;
    onOffer?: () => void;
    calculateDynamicPrice?: (product: Product) => number;
    calculateTotalPrice?: (product: Product) => number;
    customerName?: string;
    onCustomerNameChange?: (customerName: string) => void;
    onCustomerSelect?: (customer: Customer | null) => void;
    onProductSelect?: (product: Product) => void;
    selectedCustomer?: Customer | null;
    className?: string;
    userRole?: string | null;
    isEditMode?: boolean;
}

export default function SelectedProductsTable({
    products,
    onRemoveProduct,
    onUpdateQuantity,
    onUpdateDimensions,
    onAcceptDimensions,
    onProductDiscountChange,
    onUpdatePrice,
    onClearCart,
    onCheckout,
    onOffer,
    customerName = '',
    onCustomerNameChange,
    onCustomerSelect,
    onProductSelect,
    selectedCustomer = null,
    className = '',
    userRole = null,
    isEditMode = false
}: SelectedProductsTableProps) {
    const { t } = useTranslation();
    const [calculatorOpen, setCalculatorOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    // Memoized total calculation to prevent unnecessary recalculations
    const totalAmount = useMemo(() => {
        return products.reduce((total, product) => {
            // Use the new pricing service for consistent calculations
            const productTotal = calculateProductTotal(product).finalPrice;
            return total + productTotal;
        }, 0);
    }, [products]);

    const calculateTotal = useCallback(() => totalAmount, [totalAmount]);

    // Memoized product pricing calculations to avoid repeated calculations
    // Use cartItemId as key to ensure each product instance has independent pricing
    const productPricings = useMemo(() => {
        return products.map((product, index) => ({
            cartItemId: product.cartItemId ?? `${product.id}-${index}`,
            pricing: calculateProductTotal(product)
        }));
    }, [products]);

    // Helper function to get cached pricing for a product by cartItemId
    const getProductPricing = useCallback((cartItemId: string) => {
        return productPricings.find(p => p.cartItemId === cartItemId)?.pricing;
    }, [productPricings]);


    const handleCalculatorOpen = (cartItemId: string) => {
        setSelectedProductId(cartItemId);
        setCalculatorOpen(true);
    };

    const handleCalculatorClose = () => {
        setCalculatorOpen(false);
        setSelectedProductId(null);
    };

    const handleCalculatorConfirm = (value: number) => {
        if (selectedProductId && onUpdateQuantity) {
            onUpdateQuantity(selectedProductId, value);
        }
        handleCalculatorClose();
    };





    // Always show the table structure, even when empty
    const isEmpty = products.length === 0;

    return (
        <div className={`bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col h-full ${className}`}>
            {/* Header */}
            <div className="p-3 sm:p-6 pb-0">
                <div className="flex flex-col gap-3 sm:gap-4 mb-4">
                    {/* Title and Total Row */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#F58E18] dark:text-[#FB923C]" />
                            {t('pos.cart.title')} ({products.length})
                        </h3>
                        <div className="text-sm sm:text-lg font-bold text-[#F58E18] dark:text-[#FB923C]">
                            Total: {formatIQDWithSymbol(calculateTotal())}
                        </div>
                    </div>
                    
                    {/* Product Search and Customer Selection */}
                    {onProductSelect && (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                            {/* Product Search - Always enabled */}
                            <div className="flex items-center gap-2 flex-1">
                                <Search className="w-4 h-4 text-[#F58E18] dark:text-[#FB923C] flex-shrink-0" />
                                <ProductSearchDropdown
                                    onProductSelect={(product) => onProductSelect?.(product as Product)}
                                    placeholder={t('pos.searchProductsPlaceholder')}
                                    className="flex-1"
                                    role={userRole ?? undefined}
                                />
                            </div>
                            
                            {/* Customer Selection - Disabled in edit mode */}
                            {!isEditMode ? (
                                <div className="flex items-center gap-2 flex-1">
                                    <User className="w-4 h-4 text-[#3b82f6] dark:text-[#60A5FA] flex-shrink-0" />
                                    <CustomerSearchDropdown
                                        onCustomerSelect={(customer) => {
                                            onCustomerSelect?.(customer);
                                            onCustomerNameChange?.(customer.name);
                                        }}
                                        placeholder={t('pos.searchCustomersPlaceholder')}
                                        value={customerName}
                                        onClear={() => {
                                            onCustomerNameChange?.('');
                                            onCustomerSelect?.(null as Customer | null);
                                        }}
                                        className="flex-1"
                                        role={userRole ?? undefined}
                                    />
                                </div>
                            ) : (
                                /* Customer Display (Read-only) in Edit Mode */
                                selectedCustomer && (
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 flex-1">
                                        <User className="w-4 h-4 text-[#3b82f6] dark:text-[#60A5FA] flex-shrink-0" />
                                        <div className="flex-1">
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                {t('pos.checkout.customer')} ({t('pos.checkout.readOnly')})
                                            </div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {selectedCustomer.name}
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Table Container - Flexible height */}
            <div className="flex-1 overflow-x-auto px-3 sm:px-6">
                {isEmpty ? (
                    <div className="flex items-center justify-center h-full min-h-96">
                        <div className="text-center">
                            <Package className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                {t('pos.cart.empty')}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {t('pos.emptyCartMessage')}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden sm:block">
                            <table className="w-full selected-products-table">
                                <thead className="sticky top-0 bg-white dark:bg-[#1a1a1a] z-10">
                                    <tr className="border-b border-gray-200 dark:border-gray-800">
                                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                                            {t('products.table.name')}
                                        </th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                                            {t('products.table.type')}
                                        </th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                                            {t('common.labels.quantity')}
                                        </th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                                            {t('pos.dimensions.enterDimensions')}
                                        </th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                                            {t('products.table.price')}
                                        </th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                                            {t('pos.checkout.discount')}
                                        </th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                                            {t('common.labels.total')}
                                        </th>
                                        <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                                            {t('common.buttons.remove')}
                                        </th>
                                    </tr>
                                </thead>
                        <tbody>
                            {products.map((product, index) => {
                            const quantity = product.quantity || 1;
                            // Use memoized pricing calculations for better performance
                            // Use cartItemId to get correct pricing for each product instance
                            const cartItemId = product.cartItemId ?? `${product.id}-${index}`;
                            const pricing = getProductPricing(cartItemId);
                            const unitPrice = pricing?.unitPrice || 0;
                            const total = pricing?.finalPrice || 0;
                            
                            
                            const rowKey = cartItemId;
                            return (
                                <tr key={rowKey} className="border-b border-gray-100 dark:border-[#431407] hover:bg-gray-50/50 dark:hover:bg-[#431407]/50 transition-colors duration-200">
                                    <td className="py-3 px-4">
                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                            {product.name}
                                        </div>
                                        {product.type === 'width*height' && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {product.manualWidth && product.manualHeight ? (
                                                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                                                        {Math.floor(Number(product.manualWidth))} × {Math.floor(Number(product.manualHeight))} cm
                                                    </span>
                                                ) : product.width && product.height ? (
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        {typeof product.width === 'number' ? Math.floor(product.width) : Math.floor(Number(product.width))} × {typeof product.height === 'number' ? Math.floor(product.height) : Math.floor(Number(product.height))} cm
                                                    </span>
                                                ) : (
                                                    <span className="text-orange-500 dark:text-orange-400 italic">
                                                        {t('pos.dimensions.enterDimensionsBelow')}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                            {product.type}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {onUpdateQuantity ? (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => onUpdateQuantity(product.cartItemId ?? String(product.id), Math.max(1, Math.floor(quantity) - 1))}
                                                    className="w-7 h-7 rounded-full bg-gray-100 dark:bg-[#431407] hover:bg-gray-200 dark:hover:bg-[#431407] border border-gray-300 dark:border-[#431407] flex items-center justify-center text-sm font-medium text-gray-600 dark:text-[#fed7aa] hover:text-gray-800 dark:hover:text-[#fed7aa] transition-colors cursor-pointer"
                                                >
                                                    −
                                                </button>
                                                <button
                                                    onClick={() => handleCalculatorOpen(product.cartItemId ?? String(product.id))}
                                                    className="w-8 h-7 rounded bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-sm font-medium text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-colors cursor-pointer"
                                                    title={t('common.calculator')}
                                                >
                                                    {Math.floor(quantity)}
                                                </button>
                                                <button
                                                    onClick={() => onUpdateQuantity(product.cartItemId ?? String(product.id), Math.floor(quantity) + 1)}
                                                    className="w-7 h-7 rounded-full bg-gray-100 dark:bg-[#431407] hover:bg-gray-200 dark:hover:bg-[#431407] border border-gray-300 dark:border-[#431407] flex items-center justify-center text-sm font-medium text-gray-600 dark:text-[#fed7aa] hover:text-gray-800 dark:hover:text-[#fed7aa] transition-colors cursor-pointer"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="font-medium text-gray-900 dark:text-gray-100">{Math.floor(quantity)}</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        {product.type === 'width*height' && onUpdateDimensions ? (
                                            <div className="flex items-center gap-3">
                                                {/* Dimensions Inputs */}
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8">
                                                            W:
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={product.manualWidth ? Math.floor(Number(product.manualWidth)) : ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value === '' ? '' : Math.floor(Number(e.target.value)) || 0;
                                                            onUpdateDimensions(product.cartItemId ?? String(product.id), value, product.manualHeight || '');
                                                        }}
                                                            className="w-20 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                            placeholder="0"
                                                            min="0"
                                                            step="1"
                                                        />
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">cm</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8">
                                                            H:
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={product.manualHeight ? Math.floor(Number(product.manualHeight)) : ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value === '' ? '' : Math.floor(Number(e.target.value)) || 0;
                                                            onUpdateDimensions(product.cartItemId ?? String(product.id), product.manualWidth || '', value);
                                                        }}
                                                            className="w-20 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                            placeholder="0"
                                                            min="0"
                                                            step="1"
                                                        />
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">cm</span>
                                                    </div>
                                                </div>
                                                
                                                {/* Accept Button - Always visible when dimensions exist */}
                                                {product.manualWidth && product.manualHeight && (
                                                    <div className="flex flex-col gap-1">
                                                        {!product.dimensionsAccepted ? (
                                                            <button
                                                                onClick={() => onAcceptDimensions?.(product.cartItemId ?? String(product.id))}
                                                                className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-1 px-2 rounded transition-colors flex items-center gap-1 cursor-pointer"
                                                                title={t('pos.dimensions.acceptDimensions')}
                                                            >
                                                                <Check className="w-3 h-3" />
                                                                Accept
                                                            </button>
                                                        ) : (
                                                            <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs font-medium py-1 px-2 rounded flex items-center gap-1">
                                                                <Check className="w-3 h-3" />
                                                                ✓
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ) : product.type === 'kg' && onUpdateDimensions ? (
                                            <div className="flex items-center gap-3">
                                                {/* Weight Input */}
                                                <div className="flex items-center gap-1">
                                                    <label className="text-xs text-gray-500 dark:text-gray-400 w-6">
                                                        W:
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={product.manualWeight || ''}
                                                        onChange={(e) => onUpdateDimensions(product.cartItemId ?? String(product.id), '', '', e.target.value)}
                                                        className="w-12 px-1 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                        placeholder="1"
                                                        min="0"
                                                        step="0.01"
                                                    />
                                                </div>
                                                
                                                {/* Accept Button for Weight */}
                                                {product.manualWeight && (
                                                    <div className="flex flex-col gap-1">
                                                        {!product.dimensionsAccepted ? (
                                                            <button
                                                                onClick={() => onAcceptDimensions?.(product.cartItemId ?? String(product.id))}
                                                                className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-1 px-2 rounded transition-colors flex items-center gap-1 cursor-pointer"
                                                                title={t('pos.dimensions.acceptWeight')}
                                                            >
                                                                <Check className="w-3 h-3" />
                                                                Accept
                                                            </button>
                                                        ) : (
                                                            <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs font-medium py-1 px-2 rounded flex items-center gap-1">
                                                                <Check className="w-3 h-3" />
                                                                ✓
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ) : product.type === 'pcs' ? (
                                            <span className="text-gray-400 dark:text-gray-500 text-sm">-</span>
                                        ) : (
                                            <span className="text-gray-400 dark:text-gray-500 text-sm">-</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-col gap-1">
                                            <input
                                                type="number"
                                                value={product.customPrice !== undefined ? product.customPrice : unitPrice}
                                                onChange={(e) => {
                                                    const value = e.target.value ? parseFloat(e.target.value) : undefined;
                                                    onUpdatePrice?.(product.cartItemId ?? String(product.id), value);
                                                }}
                                                placeholder={String(unitPrice)}
                                                min="0"
                                                step="1"
                                                className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-800 rounded bg-white dark:bg-[#1a1a1a] text-green-600 dark:text-green-400 font-semibold placeholder-gray-500 dark:placeholder-gray-400 focus:ring-1 focus:ring-[#F58E18] focus:border-[#F58E18]"
                                            />
                                            {product.customPrice !== undefined && product.customPrice !== unitPrice && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400 line-through">
                                                    {formatIQDWithSymbol(unitPrice)}
                                                </div>
                                            )}
                                            {product.type === 'kg' && !product.customPrice && (
                                                <div className="text-xs text-gray-400 dark:text-gray-500">{product.price} IQD/kg</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-col gap-1">
                                            <input
                                                type="number"
                                                value={product.discount || ''}
                                                onChange={(e) => {
                                                    const discount = e.target.value ? parseFloat(e.target.value) : 0;
                                                    onProductDiscountChange?.(product.cartItemId ?? String(product.id), discount);
                                                }}
                                                placeholder="0"
                                                min="0"
                                                step="0.01"
                                                className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-800 rounded bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-1 focus:ring-[#F58E18] focus:border-[#F58E18]"
                                            />
                                            {product.discount && product.discount > 0 && (
                                                <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                                                    -{formatIQDWithSymbol(product.discount)}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-col gap-1">
                                            {product.discount && product.discount > 0 ? (
                                                <>
                                                    <div className="text-xs text-gray-400 dark:text-gray-500 line-through">
                                                        {formatIQDWithSymbol(pricing?.totalPrice || total + product.discount)}
                                                    </div>
                                                    <div className="font-bold text-green-600 dark:text-green-400">
                                                        {formatIQDWithSymbol(total)}
                                                    </div>
                                                    <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                                                        -{formatIQDWithSymbol(product.discount)}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="font-bold text-green-600 dark:text-green-400">
                                                    {formatIQDWithSymbol(total)}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <button
                                            onClick={() => onRemoveProduct(product.cartItemId ?? String(product.id))}
                                            className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800 cursor-pointer"
                                            title={t('common.buttons.remove')}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            );
                            })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="block sm:hidden space-y-3">
                            {products.map((product, index) => {
                                const quantity = product.quantity || 1;
                                // Use memoized pricing calculations for better performance
                                // Use cartItemId to get correct pricing for each product instance
                                const cartItemId = product.cartItemId ?? `${product.id}-${index}`;
                                const pricing = getProductPricing(cartItemId);
                                const unitPrice = pricing?.unitPrice || 0;
                                const total = pricing?.finalPrice || 0;
                                
                                
                                const cardKey = cartItemId;
                                return (
                                    <div key={cardKey} className="bg-white dark:bg-[#1a1a1a] rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                                        {/* Product Header */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm leading-tight">
                                                    {product.name}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                                        {product.type}
                                                    </span>
                                                    {product.type === 'width*height' && (
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {product.manualWidth && product.manualHeight ? (
                                                                <span className="text-blue-600 dark:text-blue-400 font-medium">
                                                                    {Math.floor(Number(product.manualWidth))} × {Math.floor(Number(product.manualHeight))} cm
                                                                </span>
                                                            ) : product.width && product.height ? (
                                                                <span className="text-gray-500 dark:text-gray-400">
                                                                    {typeof product.width === 'number' ? Math.floor(product.width) : Math.floor(Number(product.width))} × {typeof product.height === 'number' ? Math.floor(product.height) : Math.floor(Number(product.height))} cm
                                                                </span>
                                                            ) : (
                                                                <span className="text-orange-500 dark:text-orange-400 italic">
                                                                    {t('pos.dimensions.enterDimensionsBelow')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => onRemoveProduct(product.cartItemId ?? String(product.id))}
                                                className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1 rounded transition-colors"
                                                title={t('common.buttons.remove')}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {t('common.labels.quantity')}:
                                            </span>
                                            {onUpdateQuantity ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => onUpdateQuantity(product.cartItemId ?? String(product.id), Math.max(1, Math.floor(quantity) - 1))}
                                                        className="w-6 h-6 rounded-full bg-gray-200 dark:bg-[#262626] hover:bg-gray-300 dark:hover:bg-[#333333] flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors"
                                                    >
                                                        −
                                                    </button>
                                                    <button
                                                        onClick={() => handleCalculatorOpen(product.cartItemId ?? String(product.id))}
                                                        className="w-8 h-6 rounded bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-sm font-medium text-blue-600 dark:text-blue-300 transition-colors"
                                                        title={t('common.calculator')}
                                                    >
                                                        {Math.floor(quantity)}
                                                    </button>
                                                    <button
                                                        onClick={() => onUpdateQuantity(product.cartItemId ?? String(product.id), Math.floor(quantity) + 1)}
                                                        className="w-6 h-6 rounded-full bg-gray-200 dark:bg-[#262626] hover:bg-gray-300 dark:hover:bg-[#333333] flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="font-medium text-gray-900 dark:text-gray-100">{Math.floor(quantity)}</span>
                                            )}
                                        </div>

                                        {/* Dimensions Input */}
                                        {product.type === 'width*height' && onUpdateDimensions && (
                                            <div className="mb-3">
                                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    {t('pos.dimensions.enterDimensions')}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            W:
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={product.manualWidth ? Math.floor(Number(product.manualWidth)) : ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value === '' ? '' : Math.floor(Number(e.target.value)) || 0;
                                                            onUpdateDimensions(product.cartItemId ?? String(product.id), value, product.manualHeight || '');
                                                        }}
                                                            className="w-20 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                            placeholder="0"
                                                            min="0"
                                                            step="1"
                                                        />
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">cm</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            H:
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={product.manualHeight ? Math.floor(Number(product.manualHeight)) : ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value === '' ? '' : Math.floor(Number(e.target.value)) || 0;
                                                            onUpdateDimensions(product.cartItemId ?? String(product.id), product.manualWidth || '', value);
                                                        }}
                                                            className="w-20 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                            placeholder="0"
                                                            min="0"
                                                            step="1"
                                                        />
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">cm</span>
                                                    </div>
                                                    
                                                    {/* Accept Button for Mobile */}
                                                    {product.manualWidth && product.manualHeight && (
                                                        <div>
                                                            {!product.dimensionsAccepted ? (
                                                                <button
                                                                    onClick={() => onAcceptDimensions?.(product.cartItemId ?? String(product.id))}
                                                                    className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-1 px-3 rounded transition-colors flex items-center gap-1 cursor-pointer"
                                                                >
                                                                    <Check className="w-3 h-3" />
                                                                    Accept
                                                                </button>
                                                            ) : (
                                                                <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs font-medium py-1 px-3 rounded flex items-center gap-1">
                                                                    <Check className="w-3 h-3" />
                                                                    ✓
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {product.type === 'kg' && onUpdateDimensions && (
                                            <div className="mb-3">
                                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    {t('pos.dimensions.weight')}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-xs text-gray-500 dark:text-gray-400">
                                                            W:
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={product.manualWeight || ''}
                                                        onChange={(e) => onUpdateDimensions(product.cartItemId ?? String(product.id), '', '', e.target.value)}
                                                            className="w-16 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                            placeholder="1"
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                    
                                                    {/* Accept Button for Weight Mobile */}
                                                    {product.manualWeight && (
                                                        <div>
                                                            {!product.dimensionsAccepted ? (
                                                                <button
                                                                    onClick={() => onAcceptDimensions?.(product.cartItemId ?? String(product.id))}
                                                                    className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-1 px-3 rounded transition-colors flex items-center gap-1 cursor-pointer"
                                                                >
                                                                    <Check className="w-3 h-3" />
                                                                    Accept
                                                                </button>
                                                            ) : (
                                                                <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs font-medium py-1 px-3 rounded flex items-center gap-1">
                                                                    <Check className="w-3 h-3" />
                                                                    ✓
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Discount Input */}
                                        <div className="mb-3">
                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                {t('pos.checkout.discount')}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={product.discount || ''}
                                                    onChange={(e) => {
                                                        const discount = e.target.value ? parseFloat(e.target.value) : 0;
                                                        onProductDiscountChange?.(product.cartItemId ?? String(product.id), discount);
                                                    }}
                                                    placeholder="0"
                                                    min="0"
                                                    step="0.01"
                                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-800 rounded bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-1 focus:ring-[#F58E18] focus:border-[#F58E18]"
                                                />
                                                {product.discount && product.discount > 0 && (
                                                    <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                                                        -{formatIQDWithSymbol(product.discount)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Price and Total */}
                                        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                                            <div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                    {t('products.table.price')}
                                                </div>
                                                <input
                                                    type="number"
                                                    value={product.customPrice !== undefined ? product.customPrice : unitPrice}
                                                    onChange={(e) => {
                                                        const value = e.target.value ? parseFloat(e.target.value) : undefined;
                                                        onUpdatePrice?.(product.cartItemId ?? String(product.id), value);
                                                    }}
                                                    placeholder={String(unitPrice)}
                                                    min="0"
                                                    step="1"
                                                    className="w-20 px-2 py-1 text-xs border border-gray-300 dark:border-gray-800 rounded bg-white dark:bg-[#1a1a1a] text-green-600 dark:text-green-400 font-semibold placeholder-gray-500 dark:placeholder-gray-400 focus:ring-1 focus:ring-[#F58E18] focus:border-[#F58E18]"
                                                />
                                                {product.customPrice !== undefined && product.customPrice !== unitPrice && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 line-through">
                                                        {formatIQDWithSymbol(unitPrice)}
                                                    </div>
                                                )}
                                                {product.type === 'kg' && !product.customPrice && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {product.price} IQD/kg
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {t('common.labels.total')}
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    {product.discount && product.discount > 0 ? (
                                                        <>
                                                            <div className="text-xs text-gray-400 dark:text-gray-500 line-through">
                                                                {formatIQDWithSymbol(pricing?.totalPrice || total + product.discount)}
                                                            </div>
                                                            <div className="font-bold text-green-600 dark:text-green-400 text-sm">
                                                                {formatIQDWithSymbol(total)}
                                                            </div>
                                                            <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                                                                -{formatIQDWithSymbol(product.discount)}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="font-bold text-green-600 dark:text-green-400 text-sm">
                                                            {formatIQDWithSymbol(total)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
            
            
            {/* Footer - Always visible and fixed */}
            <div className="sticky bottom-0 px-3 sm:px-6 py-3 sm:py-4 pb-8 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] rounded-b-lg">
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                    {/* Clear Cart Button - Hidden in edit mode */}
                    {!isEditMode && (
                        <button
                            onClick={onClearCart}
                            disabled={isEmpty}
                            className={`px-3 py-2 sm:px-4 text-sm border rounded-lg transition-colors ${
                                isEmpty
                                    ? 'text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-800 cursor-not-allowed'
                                    : 'text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-[#262626] hover:border-red-300 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 cursor-pointer'
                            }`}
                        >
                            {t('pos.actions.clearCart')}
                        </button>
                    )}
                    {/* Offer Button - Hidden in edit mode */}
                    {!isEditMode && (
                        <button
                            onClick={onOffer}
                            disabled={isEmpty || !selectedCustomer}
                            className={`px-3 py-2 sm:px-4 text-sm border rounded-lg transition-colors ${
                                isEmpty || !selectedCustomer
                                    ? 'text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-800 cursor-not-allowed'
                                    : 'text-[#3b82f6] dark:text-[#60A5FA] border-[#3b82f6] dark:border-[#3b82f6] hover:bg-[#3b82f6] hover:text-white dark:hover:bg-[#3b82f6] dark:hover:text-white cursor-pointer'
                            }`}
                        >
                            {t('pos.actions.sendOffer')}
                        </button>
                    )}
                    <button
                        onClick={onCheckout}
                        disabled={isEmpty || !selectedCustomer}
                        className={`px-4 py-2 sm:px-6 text-sm font-medium rounded-lg transition-colors ${
                            isEmpty || !selectedCustomer
                                ? 'bg-gray-300 dark:bg-[#262626] text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                : 'bg-[#F58E18] hover:bg-[#EA580C] dark:bg-[#F58E18] dark:hover:bg-[#EA580C] text-white shadow-sm hover:shadow-md cursor-pointer'
                        }`}
                    >
                        {isEditMode ? t('pos.checkout.updateOrder') : t('pos.actions.checkout')}
                    </button>
                </div>
            </div>

            {/* Calculator Modal */}
            <LazyCalculatorModal
                isOpen={calculatorOpen}
                onClose={handleCalculatorClose}
                onConfirm={handleCalculatorConfirm}
                currentValue={selectedProductId ? products.find(p => (p.cartItemId ?? String(p.id)) === selectedProductId)?.quantity || 1 : 1}
                title={t('common.calculator')}
            />

        </div>
    );
}
