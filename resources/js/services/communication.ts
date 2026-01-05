import { apiClient } from '@/utils/apiClient';
import { Transaction, TransactionData, User, Customer } from '@/types';
import { generateInvoiceTemplate } from '@/utils/invoice-template';
// import { transformRoute } from '@/utils/routeHelper';

export interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    unit_price: number;
    total: number;
    type: string;
    width?: number;
    height?: number;
    dimensions?: string;
    weight?: string;
}

export interface OrderData {
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    order_items: OrderItem[];
    grand_total: number;
    subtotal?: number;
    discount_amount?: number;
    payment_status?: 'paid' | 'debt' | 'offer';
    custom_message?: string; // Optional custom WhatsApp message
}


export interface CommunicationResponse {
    success: boolean;
    message: string;
    whatsapp_url?: string;
    message_sid?: string;
    status?: string;
}

export interface TransactionResponse {
    success: boolean;
    message: string;
    transaction: Transaction; // Transaction data from backend
}

/**
 * Generate WhatsApp URL for order confirmation
 */
export const sendWhatsAppMessage = async (orderData: OrderData): Promise<CommunicationResponse> => {
    try {
        const response = await apiClient.post('/api/send-whatsapp-message', orderData);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate WhatsApp URL';
        throw new Error(errorMessage);
    }
};

/**
 * Open WhatsApp with pre-filled message
 */
export const openWhatsApp = (whatsappUrl: string): void => {
    window.open(whatsappUrl, '_blank');
};


export const sendOrderEmailWithInvoice = async (transactionData: TransactionData): Promise<CommunicationResponse> => {
    try {
        // Map TransactionData to Transaction format expected by generateInvoiceTemplate
        const transactionForTemplate = {
            id: transactionData.id || 0,
            order_id: transactionData.order_id || `TXN-${Date.now()}`,
            customer_id: transactionData.customer.id,
            amount: transactionData.grand_total,
            status: transactionData.status as 'paid' | 'debt',
            type: (transactionData.type as 'transaction' | 'offer') || 'transaction',
            notes: transactionData.notes,
            items: transactionData.items,
            subtotal: transactionData.subtotal,
            discount_amount: transactionData.discount_amount,
            grand_total: transactionData.grand_total,
            transaction_date: transactionData.transaction_date || new Date().toISOString(),
            created_at: transactionData.transaction_date || new Date().toISOString(),
            updated_at: transactionData.transaction_date || new Date().toISOString(),
            customer: {
                ...transactionData.customer,
                created_at: transactionData.customer.created_at || new Date().toISOString(),
                updated_at: transactionData.customer.updated_at || new Date().toISOString()
            } as Customer,
            cashier: transactionData.cashier ? {
                ...transactionData.cashier,
                created_at: transactionData.cashier.created_at || new Date().toISOString(),
                updated_at: transactionData.cashier.updated_at || new Date().toISOString()
            } as User : undefined
        };
        
        // Fetch invoice settings before generating template
        const settingsResponse = await fetch('/admin/api/invoice-settings');
        const settingsData = await settingsResponse.json();
        const settings = settingsData.settings || {};
        
        // Generate the HTML invoice template with settings
        const invoiceHTML = generateInvoiceTemplate(transactionForTemplate, settings);
        
        const requestData = {
            customer_name: transactionData.customer.name,
            customer_email: transactionData.customer.email,
            customer_phone: transactionData.customer.phone,
            order_id: transactionData.order_id || `TXN-${Date.now()}`,
            order_items: transactionData.items,
            grand_total: transactionData.grand_total,
            subtotal: transactionData.subtotal,
            discount_amount: transactionData.discount_amount,
            payment_status: transactionData.status,
            invoice_html: invoiceHTML
        };

        const response = await apiClient.post('/api/send-order-email-with-invoice', requestData);

        return response.data;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to send email with invoice';
        throw new Error(errorMessage);
    }
};

/**
 * Generate WhatsApp URL with invoice template link
 */
export const sendWhatsAppMessageWithInvoice = async (transactionData: TransactionData): Promise<CommunicationResponse> => {
    try {
        // Map TransactionData to Transaction format expected by generateInvoiceTemplate
        const transactionForTemplate = {
            id: transactionData.id || 0,
            order_id: transactionData.order_id || `TXN-${Date.now()}`,
            customer_id: transactionData.customer.id,
            amount: transactionData.grand_total,
            status: transactionData.status as 'paid' | 'debt',
            type: (transactionData.type as 'transaction' | 'offer') || 'transaction',
            notes: transactionData.notes,
            items: transactionData.items,
            subtotal: transactionData.subtotal,
            discount_amount: transactionData.discount_amount,
            grand_total: transactionData.grand_total,
            transaction_date: transactionData.transaction_date || new Date().toISOString(),
            created_at: transactionData.transaction_date || new Date().toISOString(),
            updated_at: transactionData.transaction_date || new Date().toISOString(),
            customer: {
                ...transactionData.customer,
                created_at: transactionData.customer.created_at || new Date().toISOString(),
                updated_at: transactionData.customer.updated_at || new Date().toISOString()
            } as Customer,
            cashier: transactionData.cashier ? {
                ...transactionData.cashier,
                created_at: transactionData.cashier.created_at || new Date().toISOString(),
                updated_at: transactionData.cashier.updated_at || new Date().toISOString()
            } as User : undefined
        };
        
        // Fetch invoice settings before generating template
        const settingsResponse = await fetch('/admin/api/invoice-settings');
        const settingsData = await settingsResponse.json();
        const settings = settingsData.settings || {};
        
        // Generate the HTML invoice template with settings
        const invoiceHTML = generateInvoiceTemplate(transactionForTemplate, settings);
        
        const requestData = {
            customer_name: transactionData.customer.name,
            customer_email: transactionData.customer.email,
            customer_phone: transactionData.customer.phone,
            order_id: transactionData.order_id || `TXN-${Date.now()}`,
            order_items: transactionData.items,
            grand_total: transactionData.grand_total,
            subtotal: transactionData.subtotal,
            discount_amount: transactionData.discount_amount,
            payment_status: transactionData.status,
            invoice_html: invoiceHTML
        };

        const response = await apiClient.post('/api/send-whatsapp-message-with-invoice', requestData);

        return response.data;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate WhatsApp URL with invoice';
        throw new Error(errorMessage);
    }
};

/**
 * Send offer confirmation email with PDF attachment
 */
export const sendOfferEmailWithInvoice = async (transactionData: TransactionData): Promise<CommunicationResponse> => {
    try {
        // Map TransactionData to Transaction format expected by generateInvoiceTemplate
        const transactionForTemplate = {
            id: transactionData.id || 0,
            order_id: transactionData.order_id || `TXN-${Date.now()}`,
            customer_id: transactionData.customer.id,
            amount: transactionData.grand_total,
            status: 'debt' as 'paid' | 'debt',
            type: 'offer' as 'transaction' | 'offer',
            notes: transactionData.notes,
            items: transactionData.items,
            subtotal: transactionData.subtotal,
            discount_amount: transactionData.discount_amount,
            grand_total: transactionData.grand_total,
            transaction_date: transactionData.transaction_date || new Date().toISOString(),
            created_at: transactionData.transaction_date || new Date().toISOString(),
            updated_at: transactionData.transaction_date || new Date().toISOString(),
            customer: {
                ...transactionData.customer,
                created_at: transactionData.customer.created_at || new Date().toISOString(),
                updated_at: transactionData.customer.updated_at || new Date().toISOString()
            } as Customer,
            cashier: transactionData.cashier ? {
                ...transactionData.cashier,
                created_at: transactionData.cashier.created_at || new Date().toISOString(),
                updated_at: transactionData.cashier.updated_at || new Date().toISOString()
            } as User : undefined
        };

        // Fetch invoice settings before generating template
        const settingsResponse = await fetch('/admin/api/invoice-settings');
        const settingsData = await settingsResponse.json();
        const settings = settingsData.settings || {};
        
        // Generate the HTML invoice template with settings
        const invoiceHTML = generateInvoiceTemplate(transactionForTemplate, settings);

        const requestData = {
            customer_name: transactionData.customer.name,
            customer_email: transactionData.customer.email,
            customer_phone: transactionData.customer.phone,
            order_id: transactionData.order_id || `TXN-${Date.now()}`,
            order_items: transactionData.items,
            grand_total: transactionData.grand_total,
            subtotal: transactionData.subtotal,
            discount_amount: transactionData.discount_amount,
            payment_status: 'offer',
            invoice_html: invoiceHTML
        };

        const response = await apiClient.post('/api/send-offer-email', requestData);

        return response.data;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to send offer email';
        throw new Error(errorMessage);
    }
};

/**
 * Create a new transaction
 */
export const createTransaction = async (transactionData: Partial<Transaction>): Promise<TransactionResponse> => {
    try {
        const response = await apiClient.post('/api/transactions', transactionData);
        return response.data;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create transaction';
        throw new Error(errorMessage);
    }
};


