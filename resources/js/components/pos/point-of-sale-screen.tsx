import { useState, useCallback } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';

import PageHeader, { PageHeaderActions } from '@/components/page-header';
import RefreshButton from '@/components/buttons/refresh-button';
import SelectedProductsTable from '@/components/tables/selected-products-table';
import { Button } from '@/components/ui/button';
import { LazyCheckoutModal, LazyOfferModal, LazyAddProductModal, LazyAddCustomerModal } from '@/components/lazy-imports';
import { calculateDynamicPrice, calculateTotalPrice } from '@/lib/pricing-service';
import { Customer, type SharedData } from '@/types';

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
    dimensionsAccepted?: boolean;
    created_at: string;
    updated_at: string;
}

type CartItem = Product & { cartItemId: string };

export function PointOfSaleScreen() {
    const { t } = useTranslation();
    const { auth } = usePage<SharedData>().props;
    const userRole = auth?.user?.role ?? null;
    const [selectedProducts, setSelectedProducts] = useState<CartItem[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
    const [offerModalOpen, setOfferModalOpen] = useState(false);
    const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false);

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

    const handleProductSelect = useCallback((product: Product) => {
        const newProduct: CartItem = {
            ...product,
            cartItemId: createCartItemId(),
            quantity: 1,
            manualWidth: product.type === 'width*height' && product.width
                ? parseFloat(product.width.toString().replace(' cm', '').replace(',', '.')) || 0
                : undefined,
            manualHeight: product.type === 'width*height' && product.height
                ? parseFloat(product.height.toString().replace(' cm', '').replace(',', '.')) || 0
                : undefined,
            manualWeight: product.type === 'kg' ? 1 : undefined,
        };

        setSelectedProducts(prev => [...prev, newProduct]);
    }, [createCartItemId]);

    const handleRemoveProduct = useCallback((cartItemId: string) => {
        setSelectedProducts(prev => prev.filter(p => p.cartItemId !== cartItemId));
    }, []);

    const handleUpdateQuantity = useCallback((cartItemId: string, quantity: number) => {
        if (quantity <= 0) {
            handleRemoveProduct(cartItemId);
            return;
        }

        setSelectedProducts(prev => prev.map(p =>
            p.cartItemId === cartItemId ? { ...p, quantity } : p
        ));
    }, [handleRemoveProduct]);

    const handleUpdateDimensions = useCallback((cartItemId: string, width: string | number, height: string | number, weight?: string | number) => {
        setSelectedProducts(prev => prev.map(p => {
            if (p.cartItemId === cartItemId) {
                return {
                    ...p,
                    manualWidth: width ? parseFloat(width.toString()) || 0 : undefined,
                    manualHeight: height ? parseFloat(height.toString()) || 0 : undefined,
                    manualWeight: weight ? parseFloat(weight.toString()) || 0 : undefined,
                    dimensionsAccepted: false,
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
                    title={t('pos.title')}
                    variant="elevated"
                    size="lg"
                    actions={
                        <PageHeaderActions>
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
