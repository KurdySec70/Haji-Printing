import React, { useState } from 'react';
import { User, MessageCircle, Mail, CreditCard, ShoppingCart, Percent } from 'lucide-react';
import { formatIQDWithSymbol } from '@/lib/currency';
import { OrderData, sendOfferEmailWithInvoice } from '@/services/communication';
import { TransactionData } from '@/types';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { useTransactionOperations } from '@/hooks/useTransactionOperations';
import { calculateOrderTotal, applyOrderDiscount, calculateUnitPrice } from '@/lib/pricing-service';
import { sendOfferViaWhatsApp } from '@/services/whatsapp-service';

interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
    type: 'pcs' | 'kg' | 'width*height';
    manualWidth?: number;
    manualHeight?: number;
    manualWeight?: number;
    discount?: number;
    dimensionsAccepted?: boolean;
    cartItemId?: string;
}

interface Customer {
    id: number;
    name: string;
    phone?: string;
    email?: string;
}

interface OfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    products: Product[];
    selectedCustomer: Customer | null;
    customerName?: string;
    calculateTotalPrice?: (product: Product) => number;
    onProductDiscountChange?: (productKey: string | number, discount: number) => void;
    onTransactionCreated?: () => void;
}

const OfferModal: React.FC<OfferModalProps> = ({
    isOpen,
    onClose,
    products,
    selectedCustomer,
    customerName,
    calculateTotalPrice,
    onProductDiscountChange,
    onTransactionCreated
}) => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const { createNewTransaction } = useTransactionOperations();
    const [sendEmail, setSendEmail] = useState(true);
    const [sendWhatsApp, setSendWhatsApp] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [discountAmount, setDiscountAmount] = useState<number | null>(null);
    const [showDiscountInput, setShowDiscountInput] = useState(false);

    if (!isOpen) return null;

    const handleSendOffer = async () => {
        if (!selectedCustomer) return;

        setIsProcessing(true);

        try {
            const offerData: OrderData = {
                customer_name: selectedCustomer?.name || '',
                customer_email: selectedCustomer?.email || '',
                customer_phone: selectedCustomer?.phone,
                order_items: products.map(product => ({
                    id: product.id,
                    name: product.name,
                    quantity: product.quantity,
                    unit_price: product.price,
                    total: calculateTotalPrice ? calculateTotalPrice(product) : (product.price * product.quantity),
                    type: product.type,
                    width: product.type === 'width*height' ? product.manualWidth : undefined,
                    height: product.type === 'width*height' ? product.manualHeight : undefined,
                    dimensions: product.type === 'width*height' && product.manualWidth && product.manualHeight
                        ? `${product.manualWidth}×${product.manualHeight} cm`
                        : undefined,
                    weight: product.type === 'kg' && product.manualWeight
                        ? `${product.manualWeight} kg`
                        : undefined
                })),
                grand_total: grandTotal,
                subtotal: subtotal,
                discount_amount: discountAmount || 0,
                payment_status: 'offer' // Mark as offer status
            };

            // Create offer transaction in database using new offer fields
            const offerTransactionData = {
                customer_id: selectedCustomer?.id,
                cashier_id: undefined, // Will be set by backend to current user
                amount: grandTotal,
                status: 'debt' as 'paid' | 'debt', // Use debt for offers (pending payment)
                type: 'offer', // Mark as offer type
                offer_status: 'pending' as 'pending' | 'accepted_paid' | 'accepted_debt' | 'rejected',
                notes: `Price offer sent - ${products.length} items`,
                items: offerData.order_items,
                subtotal: subtotal,
                discount_amount: discountAmount || 0,
                grand_total: grandTotal,
                customer: {
                    ...selectedCustomer!,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                cashier: undefined
            };

            // Create the offer transaction
            const result = await createNewTransaction({
                ...offerTransactionData,
                type: 'offer' as 'transaction' | 'offer',
                items: offerTransactionData.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    total: item.total,
                    type: (item.type as 'transaction' | 'offer') || 'transaction',
                    dimensions: item.dimensions,
                    weight: item.weight
                }))
            });

            let actualOfferTransaction: TransactionData;

            if (result?.success && result.data?.transaction) {
                // Use the created transaction data
                actualOfferTransaction = {
                    id: result.data.transaction.id || Date.now(),
                    order_id: result.data.transaction.order_id || `OFFER-${Date.now()}`,
                    customer_id: selectedCustomer?.id || 0,
                    amount: grandTotal,
                    customer: {
                        id: selectedCustomer?.id || 0,
                        name: selectedCustomer?.name || '',
                        email: selectedCustomer?.email,
                        phone: selectedCustomer?.phone,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    },
                    items: offerData.order_items.map((item, index) => ({
                        id: index + 1,
                        name: item.name,
                        quantity: item.quantity,
                        unit_price: item.unit_price,
                        total: item.total,
                        type: 'pcs',
                        dimensions: item.dimensions || '',
                        weight: item.weight || ''
                    })),
                    subtotal: subtotal,
                    discount_amount: discountAmount || 0,
                    grand_total: grandTotal,
                    transaction_date: new Date().toISOString(),
                    status: 'debt', // For email/WhatsApp compatibility
                    notes: `Price offer sent - ${products.length} items`
                };
            } else {
                throw new Error('Failed to create offer transaction');
            }


            // Send email with offer template if requested
            if (sendEmail && selectedCustomer?.email) {
                try {
                    await sendOfferEmailWithInvoice(actualOfferTransaction);
                } catch (error) {
                    toast({
                        title: t('pos.error.emailFailed'),
                        description: t('toast.failedToSendEmail', { error: error instanceof Error ? error.message : 'Unknown error' }),
                        variant: "destructive",
                    });
                }
            }

            // If no phone is available, show a warning but continue with the offer
            if (sendWhatsApp && (!selectedCustomer?.phone || selectedCustomer.phone.trim() === '')) {
                toast({
                    title: t('pos.error.whatsappFailed'),
                    description: t('pos.error.phoneNumberMissing'),
                    variant: "default",
                });
                // We'll skip the WhatsApp send below because the condition will be false
            }

            // Send WhatsApp message if requested and phone is available
            if (sendWhatsApp && selectedCustomer?.phone && selectedCustomer.phone.trim() !== '') {
                try {
                    await sendOfferViaWhatsApp(actualOfferTransaction);
                } catch (error) {
                    toast({
                        title: t('pos.error.whatsappFailed'),
                        description: t('toast.failedToSendWhatsApp', { error: error instanceof Error ? error.message : 'Unknown error' }),
                        variant: "destructive",
                    });
                }
            }

            // Notify parent component that offer transaction was created
            onTransactionCreated?.();

            toast({
                title: t('pos.success.offerSent'),
                description: t('pos.success.offerSentDescription', { 
                    orderId: actualOfferTransaction.order_id, 
                    customerName: selectedCustomer?.name 
                }),
                variant: 'success',
            });

            onClose();
        } catch (error: unknown) {
            toast({
                title: t('pos.checkout.failed'),
                description: error instanceof Error ? error.message : t('toast.unexpectedError'),
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    // Use the new pricing service for clean calculations
    const orderCalculation = calculateOrderTotal(products);
    const subtotal = orderCalculation.subtotal;
    // Apply additional order-level discount on top of individual product discounts
    const grandTotal = applyOrderDiscount(orderCalculation.grandTotal, discountAmount || 0);

    const customer = selectedCustomer || { name: customerName || 'Not specified' };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg sm:rounded-xl shadow-2xl dark:shadow-black/50 w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-800">
                {/* Header */}
                <div className="flex items-center p-3 sm:p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a]">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                            {t('pos.sendOfferTitle')}
                        </h2>
                    </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-140px)]">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
                        {/* Left Column - Customer & Communication */}
                        <div className="lg:col-span-1 space-y-3">
                            {/* Customer Info */}
                            <div className="bg-gray-50 dark:bg-[#262626]/30 rounded-lg p-3 border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-black/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4 text-indigo-600" />
                                    <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{t('pos.checkout.customer')}</h3>
                                </div>
                                <div className="space-y-1 text-xs sm:text-sm">
                                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                        <span className="text-gray-500 dark:text-gray-400">{t('common.labels.name')}:</span>
                                        <span className="font-medium text-gray-900 dark:text-white break-words">
                                            {customer.name}
                                        </span>
                                    </div>
                                    {selectedCustomer?.phone && (
                                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                            <span className="text-gray-500 dark:text-gray-400">{t('common.labels.phone')}:</span>
                                            <span className="font-medium text-gray-900 dark:text-white break-words">
                                                {selectedCustomer?.phone || '-'}
                                            </span>
                                        </div>
                                    )}
                                    {selectedCustomer?.email && (
                                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                            <span className="text-gray-500 dark:text-gray-400">{t('common.labels.email')}:</span>
                                            <span className="font-medium text-gray-900 dark:text-white break-words">
                                                {selectedCustomer?.email || '-'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Communication Options */}
                            <div className="bg-gray-50 dark:bg-[#262626]/30 rounded-lg p-3 border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-black/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <MessageCircle className="w-4 h-4 text-indigo-600" />
                                    <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{t('pos.checkout.sendConfirmation')}</h3>
                                </div>
                                <div className="space-y-2 sm:space-y-3">
                                    <label className={`flex items-center gap-2 sm:gap-3 cursor-pointer p-2 rounded-lg transition-all duration-200 ${
                                        !selectedCustomer?.email
                                            ? 'opacity-50 cursor-not-allowed'
                                            : sendEmail
                                                ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800'
                                                : 'hover:bg-gray-100 dark:hover:bg-[#262626]/50 border border-transparent'
                                    }`}>
                                        <div className="relative flex-shrink-0">
                                            <input
                                                type="checkbox"
                                                checked={sendEmail}
                                                onChange={(e) => setSendEmail(e.target.checked)}
                                                disabled={!selectedCustomer?.email}
                                                className="sr-only"
                                            />
                                            <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                                                sendEmail
                                                    ? 'bg-indigo-600 border-indigo-600 shadow-sm'
                                                    : 'bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-gray-800 hover:border-indigo-400 dark:hover:border-indigo-500'
                                            } ${!selectedCustomer?.email ? 'opacity-50' : ''}`}>
                                                {sendEmail && (
                                                    <svg
                                                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={3}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                                            <Mail className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${sendEmail ? 'text-indigo-600' : 'text-gray-500'}`} />
                                            <span className={`text-xs sm:text-sm font-medium truncate ${
                                                sendEmail
                                                    ? 'text-indigo-700 dark:text-indigo-300'
                                                    : 'text-gray-700 dark:text-gray-300'
                                            }`}>
                                                {t('pos.checkout.email')}
                                            </span>
                                        </div>
                                    </label>

                                    {/* WhatsApp Checkbox */}
                                    <label className={`flex items-center gap-2 sm:gap-3 cursor-pointer p-2 rounded-lg transition-all duration-200 ${
                                        !selectedCustomer?.phone
                                            ? 'opacity-50 cursor-not-allowed'
                                            : sendWhatsApp
                                                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                                : 'hover:bg-gray-100 dark:hover:bg-[#262626]/50 border border-transparent'
                                    }`}>
                                        <div className="relative flex-shrink-0">
                                            <input
                                                type="checkbox"
                                                checked={sendWhatsApp}
                                                onChange={(e) => setSendWhatsApp(e.target.checked)}
                                                disabled={!selectedCustomer?.phone}
                                                className="sr-only"
                                            />
                                            <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                                                sendWhatsApp
                                                    ? 'bg-green-600 border-green-600 shadow-sm'
                                                    : 'bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-gray-800 hover:border-green-400 dark:hover:border-green-500'
                                            } ${!selectedCustomer?.phone ? 'opacity-50' : ''}`}>
                                                {sendWhatsApp && (
                                                    <svg
                                                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={3}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                                            <MessageCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${sendWhatsApp ? 'text-green-600' : 'text-gray-500'}`} />
                                            <span className={`text-xs sm:text-sm font-medium truncate ${
                                                sendWhatsApp
                                                    ? 'text-green-700 dark:text-green-300'
                                                    : 'text-gray-700 dark:text-gray-300'
                                            }`}>
                                                {t('pos.checkout.whatsapp')}
                                            </span>
                                        </div>
                                    </label>
                                </div>
                            </div>


                            {/* Discount Section */}
                            <div className="bg-gray-50 dark:bg-[#262626]/30 rounded-lg p-3 border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-black/20">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Percent className="w-4 h-4 text-indigo-600" />
                                        <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{t('pos.checkout.discount')}</h3>
                                    </div>
                                    <button
                                        onClick={() => setShowDiscountInput(!showDiscountInput)}
                                        className="px-3 py-1.5 text-xs sm:text-sm bg-[#3b82f6] hover:bg-[#2563EB] text-white rounded-lg transition-colors duration-200 cursor-pointer self-start sm:self-auto shadow-sm hover:shadow-md"
                                    >
                                        {showDiscountInput ? t('pos.checkout.hide') : t('pos.checkout.addDiscount')}
                                    </button>
                                </div>

                                {showDiscountInput && (
                                    <div className="space-y-2">
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <input
                                                type="number"
                                                value={discountAmount || ''}
                                                onChange={(e) => setDiscountAmount(e.target.value ? parseFloat(e.target.value) : null)}
                                                placeholder={t('pos.checkout.enterDiscountAmount')}
                                                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-800 rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                            <button
                                                onClick={() => setDiscountAmount(null)}
                                                className="px-3 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#262626]/50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                                            >
                                                {t('pos.checkout.clear')}
                                            </button>
                                        </div>
                                        {discountAmount && discountAmount > 0 && (
                                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                {t('pos.checkout.discount')}: {formatIQDWithSymbol(discountAmount)}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-2 space-y-3">
                            {/* Order Header */}
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-indigo-600" />
                                <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{t('pos.checkout.orderSummary')}</h3>
                                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                    ({products.length} {products.length === 1 ? t('pos.checkout.item') : t('pos.checkout.items')})
                                </span>
                            </div>

                            {/* Products Table - Desktop View */}
                            <div className="hidden sm:block bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-white dark:bg-[#1a1a1a] sticky top-0 z-10">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    {t('pos.checkout.product')}
                                                </th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    {t('pos.checkout.size')}
                                                </th>
                                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    {t('pos.checkout.qty')}
                                                </th>
                                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    {t('pos.checkout.price')}
                                                </th>
                                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    {t('pos.checkout.discount')}
                                                </th>
                                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    {t('pos.checkout.total')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {products.map((product) => {
                                                // Use the new pricing service for individual product calculations
                                                const productCalculation = orderCalculation.items?.find(item => item.productId === product.id);
                                                const total = productCalculation ? productCalculation.finalPrice : 0;
                                                const productDiscount = product.discount || 0;
                                                return (
                                                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-[#262626]">
                                                        <td className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white">
                                                            {product.name}
                                                        </td>
                                                        <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                                            {product.type === 'width*height' && product.manualWidth && product.manualHeight
                                                                ? `${product.manualWidth}×${product.manualHeight} cm`
                                                                : product.type === 'kg' && product.manualWeight
                                                                ? `${product.manualWeight} kg`
                                                                : product.type === 'pcs'
                                                                ? 'Pieces'
                                                                : 'Standard'
                                                            }
                                                        </td>
                                                        <td className="px-3 py-2 text-sm text-gray-900 dark:text-white text-right">
                                                            {product.quantity}
                                                        </td>
                                                        <td className="px-3 py-2 text-sm text-gray-900 dark:text-white text-right">
                                                            {formatIQDWithSymbol(calculateUnitPrice(product))}
                                                        </td>
                                                        <td className="px-3 py-2 text-right">
                                                            <div className="space-y-1">
                                                                <input
                                                                    type="number"
                                                                    value={productDiscount || ''}
                                                                    onChange={(e) => {
                                                                        const discount = e.target.value ? parseFloat(e.target.value) : 0;
                                                                        onProductDiscountChange?.(product.cartItemId ?? product.id, discount);
                                                                    }}
                                                                    placeholder="0"
                                                                    className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-800 rounded bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                                                />
                                                                {productDiscount > 0 && (
                                                                    <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                                                                        -{formatIQDWithSymbol(productDiscount)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white text-right">
                                                            {formatIQDWithSymbol(total)}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile Card View */}
                            <div className="block sm:hidden space-y-3">
                                {products.map((product) => {
                                    const baseTotal = calculateTotalPrice ? calculateTotalPrice(product) : (product.price * product.quantity);
                                    const productDiscount = product.discount || 0;
                                    const total = Math.max(0, baseTotal - productDiscount);

                                    return (
                                        <div key={product.id} className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                                            <div className="space-y-2">
                                                {/* Product Name */}
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-medium text-gray-900 dark:text-white text-sm leading-tight">
                                                        {product.name}
                                                    </h4>
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white ml-2">
                                                        {formatIQDWithSymbol(total)}
                                                    </span>
                                                </div>

                                                {/* Product Details */}
                                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                    <div>
                                                        <span className="font-medium">Size:</span>
                                                        <div className="mt-0.5">
                                                            {product.type === 'width*height' && product.manualWidth && product.manualHeight
                                                                ? `${product.manualWidth}×${product.manualHeight} cm`
                                                                : product.type === 'kg' && product.manualWeight
                                                                ? `${product.manualWeight} kg`
                                                                : product.type === 'pcs'
                                                                ? 'Pieces'
                                                                : 'Standard'
                                                            }
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Qty:</span>
                                                        <div className="mt-0.5">{product.quantity}</div>
                                                    </div>
                                                </div>

                                                {/* Price and Discount */}
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Price: {formatIQDWithSymbol(calculateUnitPrice(product))}
                                                    </span>
                                                    {productDiscount > 0 && (
                                                        <span className="text-red-600 dark:text-red-400 font-medium">
                                                            -{formatIQDWithSymbol(productDiscount)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Discount Input */}
                                                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        {t('pos.checkout.discount')}:
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={productDiscount || ''}
                                                        onChange={(e) => {
                                                            const discount = e.target.value ? parseFloat(e.target.value) : 0;
                                                            onProductDiscountChange?.(product.cartItemId ?? product.id, discount);
                                                        }}
                                                        placeholder="0"
                                                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-800 rounded bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Grand Total */}
                            <div className="rounded-lg p-3 border bg-white dark:bg-[#1a1a1a] border-indigo-200 dark:border-indigo-800">
                                <div className="space-y-2">
                                    {/* Subtotal */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{t('pos.checkout.subtotal')}:</span>
                                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                                            {formatIQDWithSymbol(subtotal)}
                                        </span>
                                    </div>

                                    {/* Product Discounts Summary */}
                                    {products.some(p => (p.discount || 0) > 0) && (
                                        <div className="flex justify-between items-center bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg border border-orange-200 dark:border-orange-800">
                                            <span className="text-xs sm:text-sm font-semibold text-orange-700 dark:text-orange-300">{t('pos.checkout.productDiscounts')}:</span>
                                            <span className="text-xs sm:text-sm font-bold text-orange-700 dark:text-orange-300">
                                                -{formatIQDWithSymbol(products.reduce((sum, product) => sum + (product.discount || 0), 0))}
                                            </span>
                                        </div>
                                    )}

                                    {/* Discount */}
                                    {discountAmount && discountAmount > 0 && (
                                        <div className="flex justify-between items-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800">
                                            <span className="text-xs sm:text-sm font-semibold text-red-700 dark:text-red-300">{t('pos.checkout.discount')}:</span>
                                            <span className="text-sm sm:text-lg font-bold text-red-700 dark:text-red-300">
                                                -{formatIQDWithSymbol(discountAmount)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Grand Total */}
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-2 border-t border-gray-200 dark:border-gray-800 gap-2">
                                        <div className="flex-1">
                                            <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{t('pos.checkout.grandTotal')}</h4>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{t('pos.checkout.totalAmountToPay')}</p>
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <div className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                                {formatIQDWithSymbol(grandTotal)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fixed Footer Buttons */}
                <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] p-3 sm:p-4 shadow-sm dark:shadow-black/20">
                    <div className="flex flex-row gap-2 sm:gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#262626]/50 active:bg-gray-100 dark:active:bg-[#431407]/70 transition-colors font-medium cursor-pointer text-xs sm:text-base touch-manipulation"
                        >
                            {t('common.buttons.cancel')}
                        </button>
                        <button
                            onClick={handleSendOffer}
                            disabled={isProcessing}
                            className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 bg-[#3b82f6] hover:bg-[#2563EB] text-white rounded-lg transition-colors duration-200 font-medium flex items-center justify-center gap-1 sm:gap-2 cursor-pointer disabled:cursor-not-allowed text-xs sm:text-base touch-manipulation shadow-sm hover:shadow-md disabled:opacity-50"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                                    <span className="hidden sm:inline">Sending Offer...</span>
                                    <span className="sm:hidden">Sending...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="hidden sm:inline">{t('pos.actions.sendOffer')}</span>
                                    <span className="sm:hidden">{t('pos.actions.sendOffer')}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfferModal;