import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Download } from 'lucide-react';
import { useAssetPath } from '@/hooks/useAssetPath';
import { transformRoute } from '@/utils/routeHelper';

interface OfferTempProps {
    transaction: {
        id: string;
        order_id: string;
        customer: {
            name: string;
            email?: string;
            phone: string;
        };
        items: Array<{
            name: string;
            quantity: number;
            unit_price: number;
            total: number;
            type: string;
            dimensions?: string;
            weight?: string;
        }>;
        subtotal: number;
        discount_amount: number;
        grand_total: number;
        transaction_date: string;
        status: string;
        notes?: string;
        created_at: string;
        updated_at: string;
    };
    tempId: string;
}

export default function OfferTemp({ transaction, tempId }: OfferTempProps) {
    const [isLoading, setIsLoading] = useState(true);
    const { getLogoUrl } = useAssetPath();


    useEffect(() => {
        // Fetch invoice settings
        const fetchSettings = async () => {
            try {
                const response = await fetch('/customer/api/invoice-settings');
                const data = await response.json();
                
                // Store settings for potential use in PDF generation
                if (data.settings) {
                    (window as unknown as Record<string, unknown>).invoiceSettings = data.settings;
                }
            } catch (error) {
                console.error('Failed to load invoice settings for offer:', error);
            }
        };

        fetchSettings();

        // Simulate loading time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const formatIQDWithSymbol = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'IQD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleDownloadPDF = async () => {
        try {
            // Generate PDF from backend using the existing system
            // No CSRF token needed
            const requestData = {
                transaction_id: transaction.id,
                order_id: transaction.order_id,
                customer: transaction.customer,
                items: transaction.items,
                subtotal: transaction.subtotal,
                discount_amount: transaction.discount_amount,
                grand_total: transaction.grand_total,
                transaction_date: transaction.transaction_date,
                status: transaction.status,
                notes: transaction.notes
            };

            const response = await fetch(transformRoute('/api/generate-pdf-download'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // No CSRF token needed
                    'Accept': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                // Get the PDF blob
                const blob = await response.blob();

                // Create download link
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Offer-${transaction.order_id}.pdf`;
                document.body.appendChild(a);
                a.click();

                // Clean up
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                const errorText = await response.text();
                throw new Error(`Failed to generate PDF: ${response.status} - ${errorText}`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Failed to download PDF: ${errorMessage}. Please try again or contact support.`);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-orange-900/20 dark:to-amber-900/20 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title="Download Offer" />

            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20">
                {/* Modern Glass Header */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10">
                    <div className="max-w-4xl mx-auto px-6 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-xl ring-4 ring-amber-100/50 dark:ring-gray-700/50">
                                    <img
                                        src={getLogoUrl()}
                                        alt="Haji Logo"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                                        Haji Printing
                                    </h1>
                                </div>
                            </div>

                            <button
                                onClick={handleDownloadPDF}
                                className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:via-orange-700 hover:to-red-700 text-white rounded-2xl transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
                            >
                                <Download className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                                <span className="hidden sm:inline text-lg">Download PDF</span>
                                <span className="sm:hidden text-lg">PDF</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modern Offer Content */}
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                        {/* Modern Offer Header */}
                        <div className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 px-8 py-8 text-white overflow-hidden">
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                            <div className="relative flex justify-between items-center">
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">Haji Printing</h2>
                                    <p className="text-amber-100 text-lg font-medium">Professional Printing Services</p>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-2xl font-bold mb-1">Price Offer</h3>
                                    <p className="text-amber-100 text-lg font-medium">{transaction.order_id}</p>
                                </div>
                            </div>
                        </div>

                        {/* Modern Customer Info */}
                        <div className="px-8 py-6 border-b border-gray-200/50 dark:border-gray-700/50">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">👤</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                            Offered To
                                        </h4>
                                    </div>
                                    <div className="pl-13 space-y-2">
                                        <p className="text-gray-900 dark:text-white text-lg font-semibold">{transaction.customer.name}</p>
                                        {transaction.customer.email && (
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">📧 {transaction.customer.email}</p>
                                        )}
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">📱 {transaction.customer.phone}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">💰</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                            Offer Details
                                        </h4>
                                    </div>
                                    <div className="pl-13 space-y-2">
                                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                                            <span className="font-semibold">📅 Date:</span> {new Date(transaction.transaction_date).toLocaleDateString()}
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                                            <span className="font-semibold">Status:</span>
                                            <span className="ml-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                                                PENDING APPROVAL
                                            </span>
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                                            <span className="font-semibold">Valid Until:</span> 30 days from offer date
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modern Items */}
                        <div className="px-8 py-6">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">📦</span>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Offered Items
                                </h4>
                            </div>
                            <div className="space-y-4">
                                {transaction.items.map((item, index) => (
                                    <div key={index} className="group bg-gradient-to-r from-gray-50 to-amber-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg transition-all duration-300">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-3">
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                                                        <span className="text-white font-bold text-sm">{index + 1}</span>
                                                    </div>
                                                    <p className="font-bold text-gray-900 dark:text-white text-lg">{item.name}</p>
                                                </div>
                                                <div className="pl-11 space-y-1">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Type: {item.type}</p>
                                                    {item.dimensions && (
                                                        <p className="text-sm text-gray-500 dark:text-gray-500">
                                                            📏 Dimensions: {item.dimensions}
                                                        </p>
                                                    )}
                                                    {item.weight && (
                                                        <p className="text-sm text-gray-500 dark:text-gray-500">
                                                            ⚖️ Weight: {item.weight}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right ml-6">
                                                <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                                    {formatIQDWithSymbol(item.total)}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {item.quantity} × {formatIQDWithSymbol(item.unit_price)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modern Totals */}
                        <div className="px-8 py-6 bg-gradient-to-r from-gray-50 via-amber-50 to-orange-50 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 border-t border-gray-200/50 dark:border-gray-600/50">
                            <div className="max-w-md ml-auto">
                                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-600/50">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-700 dark:text-gray-300 font-medium">Subtotal:</span>
                                            <span className="text-gray-900 dark:text-white font-semibold text-lg">{formatIQDWithSymbol(transaction.subtotal)}</span>
                                        </div>
                                        {transaction.discount_amount > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-700 dark:text-gray-300 font-medium">Discount:</span>
                                                <span className="text-red-600 dark:text-red-400 font-semibold text-lg">-{formatIQDWithSymbol(transaction.discount_amount)}</span>
                                            </div>
                                        )}
                                        <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-900 dark:text-white font-bold text-xl">Offer Total:</span>
                                                <span className="text-gray-900 dark:text-white font-bold text-2xl">
                                                    {formatIQDWithSymbol(transaction.grand_total)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Call to Action Section */}
                        <div className="px-8 py-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 border-t border-gray-200/50 dark:border-gray-600/50">
                            <div className="text-center space-y-4">
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                    📞 Next Steps
                                </h4>
                                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-600/50">
                                    <ul className="space-y-3 text-left text-gray-700 dark:text-gray-300">
                                        <li className="flex items-center space-x-3">
                                            <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                            <span>Review the detailed price breakdown above</span>
                                        </li>
                                        <li className="flex items-center space-x-3">
                                            <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                            <span>Contact us to discuss any modifications</span>
                                        </li>
                                        <li className="flex items-center space-x-3">
                                            <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                            <span>Confirm your order to proceed with production</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Modern Footer */}
                        <div className="px-8 py-6 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white text-center">
                            <div className="space-y-3">
                                <p className="text-lg font-bold">
                                    💰 Thank you for considering Haji Printing!
                                </p>
                                <p className="text-amber-100 text-sm">
                                    This offer is valid for 30 days from the date of issue
                                </p>
                                <div className="pt-2 border-t border-amber-400/30">
                                    <p className="text-amber-200 text-xs">
                                        Offer ID: {tempId}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}