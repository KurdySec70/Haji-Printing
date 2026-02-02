import { useState, useCallback, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { User, X } from 'lucide-react';

import PageHeader, { PageHeaderActions } from '@/components/page-header';
import RefreshButton from '@/components/buttons/refresh-button';
import SelectedProductsTable from '@/components/tables/selected-products-table';
import { Button } from '@/components/ui/button';
import { LazyCheckoutModal, LazyOfferModal, LazyAddProductModal, LazyAddCustomerModal } from '@/components/lazy-imports';
import { calculateDynamicPrice, calculateTotalPrice, calculateProductTotal } from '@/lib/pricing-service';
import { Customer, Transaction, Product as ApiProduct, type SharedData } from '@/types';

interface CartProduct {
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
    dimensionsAccepted?: boolean;
    customPrice?: number; // Manual price override for this transaction only
    created_at: string;
    updated_at: string;
}

type CartItem = CartProduct & { cartItemId: string };

interface PointOfSaleScreenProps {
    products?: ApiProduct[];
    transactionToEdit?: Transaction | null;
}

export function PointOfSaleScreen({ products: initialProducts = [], transactionToEdit = null }: PointOfSaleScreenProps) {
    const { t } = useTranslation();
    const { auth } = usePage<SharedData>().props;
    const userRole = auth?.user?.role ?? null;
    const isEditMode = !!transactionToEdit;
    const [selectedProducts, setSelectedProducts] = useState<CartItem[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
    const [offerModalOpen, setOfferModalOpen] = useState(false);
    const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false);

    // Initialize cart and customer from transaction when in edit mode
    useEffect(() => {
        if (isEditMode && transactionToEdit) {
            // Check if transaction has items
            if (!transactionToEdit.items || !Array.isArray(transactionToEdit.items) || transactionToEdit.items.length === 0) {
                console.warn('Transaction has no items to edit:', transactionToEdit);
                return;
            }

            // Convert transaction items to cart items
            const cartItems: CartItem[] = transactionToEdit.items.map((item, index: number) => {
                // Parse dimensions if available
                let manualWidth: number | undefined;
                let manualHeight: number | undefined;
                let manualWeight: number | undefined;

                if (item.dimensions) {
                    const dimMatch = item.dimensions.match(/(\d+)\s*×\s*(\d+)\s*cm/);
                    if (dimMatch) {
                        manualWidth = parseInt(dimMatch[1]);
                        manualHeight = parseInt(dimMatch[2]);
                    }
                }

                if (item.weight) {
                    const weightMatch = item.weight.match(/(\d+(?:\.\d+)?)\s*kg/);
                    if (weightMatch) {
                        manualWeight = parseFloat(weightMatch[1]);
                    }
                }

                // Find the original product to get base price and dimensions
                const originalProduct = (initialProducts as ApiProduct[]).find((p: ApiProduct) => p.id === item.id);
                
                // For width*height products, use original product's base price and dimensions
                // For other types, use unit_price as base price
                let basePrice = item.unit_price || 0;
                let baseWidth: number | undefined;
                let baseHeight: number | undefined;
                
                if (item.type === 'width*height') {
                    if (originalProduct) {
                        // Use original product's base price (this is the correct base price)
                        basePrice = parseFloat(String(originalProduct.price)) || 0;
                        // Parse base dimensions from product
                        if (originalProduct.width) {
                            const widthMatch = String(originalProduct.width).match(/(\d+(?:\.\d+)?)/);
                            if (widthMatch) {
                                baseWidth = parseFloat(widthMatch[1]);
                            }
                        }
                        if (originalProduct.height) {
                            const heightMatch = String(originalProduct.height).match(/(\d+(?:\.\d+)?)/);
                            if (heightMatch) {
                                baseHeight = parseFloat(heightMatch[1]);
                            }
                        }
                        
                        // Debug log
                        if (!basePrice || basePrice === 0 || !baseWidth || !baseHeight) {
                            console.warn(`Warning: Missing base data for width*height product ${item.name} (ID: ${item.id})`, {
                                originalProduct,
                                basePrice,
                                baseWidth,
                                baseHeight,
                                manualWidth,
                                manualHeight
                            });
                        }
                    } else {
                        // Fallback: If product not found, we need to reverse-calculate
                        // For width*height products, item.unit_price is the CALCULATED unit price
                        // We need to reverse-engineer the base price and base dimensions
                        console.warn(`Warning: Original product not found for width*height item ${item.name} (ID: ${item.id}). Attempting reverse calculation.`);
                        
                        if (manualWidth && manualHeight && item.unit_price && item.total) {
                            const calculatedUnitPrice = parseFloat(String(item.unit_price)) || 0;
                            
                            // Reverse-calculate: We know calculatedUnitPrice = basePrice * (manualArea / baseArea)
                            // And storedTotal = (calculatedUnitPrice * quantity) - discount
                            // So: storedTotal + discount = calculatedUnitPrice * quantity
                            // This should match, so we can use calculatedUnitPrice as basePrice
                            // and manual dimensions as base dimensions (1:1 ratio)
                            // This will make the calculation work correctly
                            basePrice = calculatedUnitPrice;
                            baseWidth = manualWidth;
                            baseHeight = manualHeight;
                        } else {
                            // Last resort: use unit_price as base and manual as base dimensions
                            basePrice = parseFloat(String(item.unit_price)) || 0;
                            baseWidth = manualWidth;
                            baseHeight = manualHeight;
                        }
                    }
                }

                // Handle kg products - use original product's base price
                if (item.type === 'kg') {
                    if (originalProduct) {
                        // Use original product's base price (this is the correct base price)
                        basePrice = parseFloat(String(originalProduct.price)) || 0;
                        
                        // Debug log
                        if (!basePrice || basePrice === 0) {
                            console.warn(`Warning: Missing base price for kg product ${item.name} (ID: ${item.id})`, {
                                originalProduct,
                                basePrice,
                                manualWeight
                            });
                        }
                    } else {
                        // Fallback: If product not found, reverse-calculate base price
                        // For kg products, item.unit_price is the CALCULATED unit price
                        // We need to reverse-engineer the base price
                        console.warn(`Warning: Original product not found for kg item ${item.name} (ID: ${item.id}). Attempting reverse calculation.`);
                        
                        if (manualWeight && item.unit_price) {
                            const calculatedUnitPrice = parseFloat(String(item.unit_price)) || 0;
                            // Reverse-calculate: calculatedUnitPrice = basePrice * manualWeight
                            // So: basePrice = calculatedUnitPrice / manualWeight
                            if (manualWeight > 0) {
                                basePrice = calculatedUnitPrice / manualWeight;
                            } else {
                                basePrice = calculatedUnitPrice;
                            }
                        } else {
                            // Last resort: use unit_price as base price
                            basePrice = parseFloat(String(item.unit_price)) || 0;
                        }
                    }
                }
                
                // Ensure basePrice is valid for width*height products
                if (item.type === 'width*height' && (!basePrice || basePrice === 0)) {
                    console.warn(`Warning: Base price is 0 for width*height product ${item.name} (ID: ${item.id}). Using unit_price as fallback.`);
                    basePrice = item.unit_price || 0;
                }
                
                // Ensure base dimensions are set for width*height products
                if (item.type === 'width*height' && (!baseWidth || !baseHeight)) {
                    console.warn(`Warning: Base dimensions missing for width*height product ${item.name} (ID: ${item.id}). Using manual dimensions as fallback.`);
                    baseWidth = manualWidth;
                    baseHeight = manualHeight;
                }
                
                // Ensure basePrice is valid for kg products
                if (item.type === 'kg' && (!basePrice || basePrice === 0)) {
                    console.warn(`Warning: Base price is 0 for kg product ${item.name} (ID: ${item.id}). Using unit_price as fallback.`);
                    basePrice = parseFloat(String(item.unit_price)) || 0;
                }
                
                // Ensure manualWeight is set and dimensionsAccepted is true for kg products
                if (item.type === 'kg' && (!manualWeight || manualWeight === 0)) {
                    console.warn(`Warning: Manual weight missing for kg product ${item.name} (ID: ${item.id}). Using default weight 1.`);
                    manualWeight = 1;
                }

                const cartItem: CartItem = {
                    id: item.id || index,
                    name: item.name || 'Unknown Product',
                    price: basePrice,
                    quantity: item.quantity || 1,
                    type: (item.type || 'pcs') as 'pcs' | 'kg' | 'width*height',
                    width: baseWidth,
                    height: baseHeight,
                    manualWidth,
                    manualHeight,
                    manualWeight,
                    discount: item.discount || 0,
                    dimensionsAccepted: true,
                    cartItemId: `edit-${transactionToEdit.id}-${index}`,
                    created_at: transactionToEdit.created_at || new Date().toISOString(),
                    updated_at: transactionToEdit.updated_at || new Date().toISOString(),
                };

                // Verify calculation matches stored total for kg products
                // This ensures the displayed values match the transaction detail modal exactly
                if (item.type === 'kg' && item.total && basePrice > 0 && manualWeight) {
                    const calculatedTotal = calculateProductTotal(cartItem).finalPrice;
                    const storedTotal = parseFloat(String(item.total)) || 0;
                    
                    // If calculated total doesn't match stored total, adjust base price or manual weight
                    if (Math.abs(calculatedTotal - storedTotal) > 0.01) {
                        const calculatedUnitPrice = parseFloat(String(item.unit_price)) || 0;
                        
                        if (calculatedUnitPrice > 0 && manualWeight > 0) {
                            // Reverse-calculate: calculatedUnitPrice = basePrice * manualWeight
                            // So: basePrice = calculatedUnitPrice / manualWeight
                            const recalculatedBasePrice = calculatedUnitPrice / manualWeight;
                            if (recalculatedBasePrice > 0 && isFinite(recalculatedBasePrice)) {
                                cartItem.price = recalculatedBasePrice;
                            }
                        }
                    }
                }
                
                // Verify calculation matches stored total for width*height products
                // This ensures the displayed values match the transaction detail modal exactly
                if (item.type === 'width*height' && item.total && baseWidth && baseHeight && manualWidth && manualHeight && basePrice > 0) {
                    const calculatedTotal = calculateProductTotal(cartItem).finalPrice;
                    const storedTotal = parseFloat(String(item.total)) || 0;
                    
                    // If calculated total doesn't match stored total, adjust base price or dimensions
                    // This handles cases where product data might be missing or incorrect
                    if (Math.abs(calculatedTotal - storedTotal) > 0.01) {
                        // Reverse-calculate: find base price and dimensions that would give us the stored total
                        // Formula: storedTotal = (basePrice * (manualArea / baseArea) * quantity) - discount
                        // We have two unknowns: basePrice and baseArea
                        // Strategy: If original product not found, adjust base price to match
                        
                        const manualArea = manualWidth * manualHeight;
                        const quantity = item.quantity || 1;
                        const discount = item.discount || 0;
                        const calculatedUnitPrice = parseFloat(String(item.unit_price)) || 0;
                        
                        if (manualArea > 0 && quantity > 0) {
                            if (!originalProduct && calculatedUnitPrice > 0) {
                                // Product not found: reverse-calculate base price from calculated unit price
                                // calculatedUnitPrice = basePrice * (manualArea / baseArea)
                                // If baseArea = manualArea (1:1), then basePrice = calculatedUnitPrice
                                // But we need to find the actual baseArea that gives us the stored total
                                
                                // Try: basePrice = calculatedUnitPrice, solve for baseArea
                                // storedTotal = (calculatedUnitPrice * quantity) - discount
                                // This should match if baseArea = manualArea
                                
                                // Actually, let's solve: storedTotal + discount = basePrice * (manualArea / baseArea) * quantity
                                // If we assume basePrice = calculatedUnitPrice when baseArea = manualArea
                                // Then: storedTotal + discount = calculatedUnitPrice * quantity
                                // If this doesn't match, we need to adjust baseArea
                                
                                const expectedTotalBeforeDiscount = storedTotal + discount;
                                const expectedUnitPrice = expectedTotalBeforeDiscount / quantity;
                                
                                // If expectedUnitPrice != calculatedUnitPrice, we need to adjust baseArea
                                if (Math.abs(expectedUnitPrice - calculatedUnitPrice) > 0.01 && calculatedUnitPrice > 0) {
                                    // Calculate what baseArea would give us expectedUnitPrice
                                    // expectedUnitPrice = basePrice * (manualArea / baseArea)
                                    // baseArea = (basePrice * manualArea) / expectedUnitPrice
                                    // But we don't know basePrice...
                                    
                                    // Alternative: Use calculatedUnitPrice as basePrice and solve for baseArea
                                    const expectedBaseArea = (calculatedUnitPrice * manualArea) / expectedUnitPrice;
                                    if (expectedBaseArea > 0 && isFinite(expectedBaseArea)) {
                                        const areaRatio = manualArea / expectedBaseArea;
                                        const dimensionRatio = Math.sqrt(areaRatio);
                                        if (dimensionRatio > 0 && isFinite(dimensionRatio)) {
                                            cartItem.width = Math.round(manualWidth / dimensionRatio);
                                            cartItem.height = Math.round(manualHeight / dimensionRatio);
                                        }
                                    }
                                } else {
                                    // They match, so basePrice = calculatedUnitPrice and baseArea = manualArea
                                    cartItem.price = calculatedUnitPrice;
                                }
                            } else if (originalProduct) {
                                // Product found but calculation doesn't match - adjust base dimensions
                                const expectedBaseArea = (basePrice * manualArea * quantity) / (storedTotal + discount);
                                if (expectedBaseArea > 0 && isFinite(expectedBaseArea)) {
                                    const areaRatio = manualArea / expectedBaseArea;
                                    const dimensionRatio = Math.sqrt(areaRatio);
                                    if (dimensionRatio > 0 && isFinite(dimensionRatio)) {
                                        cartItem.width = Math.round(manualWidth / dimensionRatio);
                                        cartItem.height = Math.round(manualHeight / dimensionRatio);
                                    }
                                }
                            }
                        }
                    }
                }

                return cartItem;
            });

            setSelectedProducts(cartItems);
            
            if (transactionToEdit.customer) {
                setSelectedCustomer(transactionToEdit.customer);
                setCustomerName(transactionToEdit.customer.name || '');
            }
        }
    }, [isEditMode, transactionToEdit, initialProducts]);

    const handleRefresh = useCallback(() => {
        router.reload();
    }, []);

    const handleCustomerSelect = useCallback((customer: Customer | null) => {
        setSelectedCustomer(customer);
        setCustomerName(customer?.name || '');
    }, []);

    const handleCustomerNameChange = useCallback((name: string) => {
        setCustomerName(name);
    }, []);

    const createCartItemId = useCallback(() => `${Date.now()}-${Math.random().toString(16).slice(2)}`, []);

    const handleProductSelect = useCallback((product: ApiProduct) => {
        const newProduct: CartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            type: product.type,
            width: product.width,
            height: product.height,
            quantity: 1,
            cartItemId: createCartItemId(),
            manualWidth: product.type === 'width*height' && product.width
                ? parseFloat(product.width.toString().replace(' cm', '').replace(',', '.')) || 0
                : undefined,
            manualHeight: product.type === 'width*height' && product.height
                ? parseFloat(product.height.toString().replace(' cm', '').replace(',', '.')) || 0
                : undefined,
            manualWeight: product.type === 'kg' ? 1 : undefined,
            created_at: product.created_at,
            updated_at: product.updated_at,
        };

        setSelectedProducts(prev => [...prev, newProduct]);
    }, [createCartItemId]);

    const handleRemoveProduct = useCallback((cartItemId: string) => {
        setSelectedProducts(prev => prev.filter(p => p.cartItemId !== cartItemId));
    }, []);

    const handleUpdateQuantity = useCallback((cartItemId: string, quantity: number) => {
        // Ensure quantity is always an integer (whole number)
        const integerQuantity = Math.floor(Math.max(1, quantity));
        
        if (integerQuantity <= 0) {
            handleRemoveProduct(cartItemId);
            return;
        }

        setSelectedProducts(prev => prev.map(p =>
            p.cartItemId === cartItemId ? { ...p, quantity: integerQuantity } : p
        ));
    }, [handleRemoveProduct]);

    const handleUpdateDimensions = useCallback((cartItemId: string, width: string | number, height: string | number, weight?: string | number) => {
        setSelectedProducts(prev => prev.map(p => {
            if (p.cartItemId === cartItemId) {
                return {
                    ...p,
                    // For width*height products, store as whole numbers (no decimals)
                    manualWidth: width ? Math.floor(Number(width)) || 0 : undefined,
                    manualHeight: height ? Math.floor(Number(height)) || 0 : undefined,
                    // Weight (kg) can still have decimals
                    manualWeight: weight ? parseFloat(weight.toString()) || 0 : undefined,
                    dimensionsAccepted: false,
                    // Clear custom price when dimensions/weight change so it recalculates
                    customPrice: undefined,
                };
            }
            return p;
        }));
    }, []);

    const handleAcceptDimensions = useCallback((cartItemId: string) => {
        setSelectedProducts(prev => prev.map(product =>
            product.cartItemId === cartItemId
                ? { ...product, dimensionsAccepted: true }
                : product
        ));
    }, []);

    const handleClearCart = useCallback(() => {
        setSelectedProducts([]);
        setCustomerName('');
        setSelectedCustomer(null);
    }, []);

    const handleQuitEditMode = useCallback(() => {
        // Clear cart and navigate back to transactions page
        handleClearCart();
        router.visit('/admin/transactions');
    }, [handleClearCart]);

    const handleCheckout = useCallback(() => {
        setCheckoutModalOpen(true);
    }, []);

    const handleCloseCheckoutModal = useCallback(() => {
        setCheckoutModalOpen(false);
    }, []);

    const handleOffer = useCallback(() => {
        setOfferModalOpen(true);
    }, []);

    const handleCloseOfferModal = useCallback(() => {
        setOfferModalOpen(false);
    }, []);

    const handleTransactionCreated = useCallback(() => {
        handleClearCart();
        setCheckoutModalOpen(false);
    }, [handleClearCart]);

    const handleProductDiscountChange = useCallback((cartItemKey: string | number, discount: number) => {
        const targetId = cartItemKey.toString();

        setSelectedProducts(prev => prev.map(product =>
            product.cartItemId === targetId
                ? { ...product, discount }
                : product
        ));
    }, []);

    const handleUpdatePrice = useCallback((cartItemId: string, customPrice: number | undefined) => {
        setSelectedProducts(prev => prev.map(product =>
            product.cartItemId === cartItemId
                ? { ...product, customPrice }
                : product
        ));
    }, []);

    const handleProductAdded = useCallback(() => {
        router.reload();
    }, []);

    const handleCustomerAdded = useCallback((customer: Customer) => {
        setSelectedCustomer(customer);
        setCustomerName(customer.name);
        setAddCustomerModalOpen(false);
    }, []);

    return (
        <>
            <Head title={`${t('pos.title')} - ${t('app.name')}`} />

            <div className="flex h-screen flex-col gap-3 p-3 sm:gap-6 sm:p-6 bg-white dark:bg-[#0a0a0a]">
                <PageHeader
                    title={isEditMode ? t('pos.checkout.editTitle') : t('pos.title')}
                    variant="elevated"
                    size="lg"
                    actions={
                        <PageHeaderActions>
                            {isEditMode && (
                                <Button
                                    onClick={handleQuitEditMode}
                                    variant="outline"
                                    className="px-6 py-4 text-base font-medium flex items-center gap-2"
                                >
                                    <X className="w-5 h-5" />
                                    {t('common.buttons.cancel')}
                                </Button>
                            )}
                            {!isEditMode && (
                                <>
                                    <RefreshButton onRefresh={handleRefresh} />
                                    <Button
                                        onClick={() => setAddCustomerModalOpen(true)}
                                        variant="blue"
                                        className="px-6 py-4 text-base font-medium flex items-center gap-2"
                                    >
                                        <User className="w-5 h-5" />
                                        {t('common.buttons.add')} {t('customers.title')}
                                    </Button>
                                    <LazyAddProductModal onProductAdded={handleProductAdded} />
                                </>
                            )}
                            <LazyAddCustomerModal
                                onCustomerAdded={handleCustomerAdded}
                                isOpen={addCustomerModalOpen}
                                onClose={() => setAddCustomerModalOpen(false)}
                            />
                        </PageHeaderActions>
                    }
                />

                <div className="flex-1 min-h-0">
                    <SelectedProductsTable
                        products={selectedProducts}
                        onRemoveProduct={handleRemoveProduct}
                        onUpdateQuantity={handleUpdateQuantity}
                        onUpdateDimensions={handleUpdateDimensions}
                        onAcceptDimensions={handleAcceptDimensions}
                        onProductDiscountChange={handleProductDiscountChange}
                        onUpdatePrice={handleUpdatePrice}
                        onClearCart={handleClearCart}
                        onCheckout={handleCheckout}
                        onOffer={handleOffer}
                        calculateDynamicPrice={calculateDynamicPrice}
                        calculateTotalPrice={calculateTotalPrice}
                        customerName={customerName}
                        onCustomerNameChange={handleCustomerNameChange}
                        onCustomerSelect={handleCustomerSelect}
                        onProductSelect={handleProductSelect}
                        selectedCustomer={selectedCustomer}
                        userRole={userRole}
                        isEditMode={isEditMode}
                        className="h-full"
                    />
                </div>
            </div>

            <LazyCheckoutModal
                isOpen={checkoutModalOpen}
                onClose={handleCloseCheckoutModal}
                products={selectedProducts}
                selectedCustomer={selectedCustomer}
                customerName={customerName}
                calculateTotalPrice={calculateTotalPrice}
                onProductDiscountChange={handleProductDiscountChange}
                onTransactionCreated={handleTransactionCreated}
                transactionToEdit={transactionToEdit}
                onTransactionUpdated={() => {
                    handleTransactionCreated();
                    // Navigate back to transactions page after update
                    router.visit('/admin/transactions');
                }}
            />

            <LazyOfferModal
                isOpen={offerModalOpen}
                onClose={handleCloseOfferModal}
                products={selectedProducts}
                selectedCustomer={selectedCustomer}
                customerName={customerName}
                calculateTotalPrice={calculateTotalPrice}
                onProductDiscountChange={handleProductDiscountChange}
                onTransactionCreated={handleTransactionCreated}
            />
        </>
    );
}

export default PointOfSaleScreen;
