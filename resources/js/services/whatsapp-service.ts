import { formatIQDWithSymbol } from '@/lib/currency';
import { OrderData, sendWhatsAppMessage } from '@/services/communication';
import { TransactionData } from '@/types';

/**
 * Open WhatsApp with better compatibility for desktop and mobile
 */
const openWhatsApp = async (url: string, message: string, phoneNumber: string) => {
    
    // Try to use navigator.share API for mobile devices (better UX)
    if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        try {
            await navigator.share({
                title: 'Share via WhatsApp',
                text: message,
                url: `https://wa.me/${phoneNumber}`
            });
            return { success: true };
        } catch {
            // Navigator share failed, falling back to direct URL
        }
    }
    
    // Direct URL method - try multiple approaches for better compatibility
    const urls = [
        url, // Original URL from backend
        `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`, // API URL (preferred)
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, // Standard wa.me (fallback)
        `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}` // Protocol handler (fallback)
    ];
    
    for (const testUrl of urls) {
        try {
            
            // Create a temporary link and click it
            const link = document.createElement('a');
            link.href = testUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            
            // Add to DOM temporarily
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            return { success: true };
        } catch {
            continue;
        }
    }
    
    throw new Error('Failed to open WhatsApp with any method');
};

/**
 * Format Iraqi phone number for WhatsApp
 */
const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters except +
    let cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // Remove existing country code if present
    cleanPhone = cleanPhone.replace(/^\+?964/, '');
    cleanPhone = cleanPhone.replace(/^\+/, '');
    
    // Format Iraqi numbers with country code
    if (cleanPhone.startsWith('07') && cleanPhone.length === 10) {
        // 07XXXXXXXX -> 9647XXXXXXXX
        return '964' + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith('7') && cleanPhone.length === 9) {
        // 7XXXXXXXX -> 9647XXXXXXXX
        return '964' + cleanPhone;
    } else if (cleanPhone.startsWith('0') && cleanPhone.length >= 9) {
        // Remove leading 0 and add country code
        return '964' + cleanPhone.substring(1);
    } else if (cleanPhone.length >= 9) {
        // Add country code
        return '964' + cleanPhone;
    }
    
    // Default: add country code
    return '964' + cleanPhone;
};

/**
 * Send invoice via WhatsApp using the provided transaction data
 */
export const sendOfferViaWhatsApp = async (transactionData: TransactionData) => {
    try {
        // Validate that customer data exists
        if (!transactionData.customer || !transactionData.customer.name) {
            throw new Error('Customer information is missing');
        }

        // Validate that phone number exists and is not empty
        if (!transactionData.customer.phone || transactionData.customer.phone.trim() === '') {
            throw new Error('Customer phone number is missing or invalid');
        }

        // Format the phone number properly
        const formattedPhone = formatPhoneNumber(transactionData.customer.phone);

        // Create offer-specific message data (matching backend expectations)
        const offerData = {
            customer_name: transactionData.customer.name,
            customer_phone: formattedPhone,
            customer_email: transactionData.customer.email || '',
            offer_id: transactionData.order_id,
            order_id: transactionData.order_id, // Backend expects this field
            order_items: transactionData.items.map((item) => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total: item.total,
                type: item.type || 'pcs',
                dimensions: item.dimensions || '',
                weight: item.weight || ''
            })),
            subtotal: transactionData.subtotal,
            discount_amount: transactionData.discount_amount,
            grand_total: transactionData.grand_total,
            order_date: new Date(transactionData.transaction_date || new Date()).toLocaleDateString() + ' ' + new Date(transactionData.transaction_date || new Date()).toLocaleTimeString(),
            notes: transactionData.notes,
            type: 'offer' // Mark as offer type
        };

        // Call backend to generate offer WhatsApp message
        const response = await sendWhatsAppMessage(offerData);

        if (response.success && response.whatsapp_url) {
            return await openWhatsApp(response.whatsapp_url, response.message || '', formattedPhone);
        } else {
            throw new Error(response.message || 'Failed to generate offer WhatsApp URL');
        }
    } catch {
        console.error('Error sending offer via WhatsApp');
        throw new Error('Failed to send offer via WhatsApp');
    }
};

export const sendInvoiceViaWhatsApp = async (transactionData: TransactionData) => {
    try {
        // Validate that customer data exists
        if (!transactionData.customer || !transactionData.customer.name) {
            throw new Error('Customer information is missing');
        }
        
        // Validate that phone number exists and is not empty
        if (!transactionData.customer.phone || transactionData.customer.phone.trim() === '') {
            throw new Error('Customer phone number is missing or invalid');
        }

        // Format the phone number properly
        const formattedPhone = formatPhoneNumber(transactionData.customer.phone);

        // Prepare order data for backend
        const orderData: OrderData = {
            customer_name: transactionData.customer.name,
            customer_phone: transactionData.customer.phone,
            customer_email: transactionData.customer.email || '',
            order_items: transactionData.items.map((item) => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total: item.total,
                type: item.type || 'pcs',
                dimensions: item.dimensions || '',
                weight: item.weight || ''
            })),
            grand_total: transactionData.grand_total,
            subtotal: transactionData.subtotal,
            discount_amount: transactionData.discount_amount,
            payment_status: transactionData.status === 'paid' ? 'paid' : 'debt'
        };
        
        // Try to get WhatsApp URL from backend
        try {
            const whatsappResponse = await sendWhatsAppMessage(orderData);
            
            if (whatsappResponse.success && whatsappResponse.whatsapp_url) {
                // Extract message from the URL for sharing
                const urlObj = new URL(whatsappResponse.whatsapp_url);
                const message = urlObj.searchParams.get('text') || '';
                
                return await openWhatsApp(whatsappResponse.whatsapp_url, decodeURIComponent(message), formattedPhone);
            } else {
                throw new Error(whatsappResponse.message || 'Failed to generate WhatsApp URL');
            }
        } catch {
            
            // Fallback: create simple message (optimized for shorter text)
            const fallbackMessage = `سڵاو ${transactionData.customer.name}\n\n` +
                `📋 *Order:* ${transactionData.order_id}\n` +
                `💵 *Total:* ${formatIQDWithSymbol(transactionData.grand_total)}\n\n` +
                `✅ *Thank you!*`;
            
            const fallbackUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(fallbackMessage)}`;
            
            return await openWhatsApp(fallbackUrl, fallbackMessage, formattedPhone);
        }
        
    } catch {
        console.error('WhatsApp sending failed completely');
        throw new Error('WhatsApp sending failed');
    }
};