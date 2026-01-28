import { formatIQDWithSymbol } from '@/lib/currency';
import { Transaction } from '@/types';

export interface InvoiceSettings {
    header_color: string;
    footer_color: string;
    table_header_color: string;
    primary_font: string;
    font_size_base: number;
    font_weight?: string;
    logo_width: number;
    logo_height: number;
    logo_url?: string;
    company_title: string;
    company_name: string;
    company_address?: string;
    company_phone_1?: string;
    company_phone_2?: string;
    company_email?: string;
    company_website?: string;
    header_height: number;
    footer_height: number;
    show_logo: boolean;
    show_company_info: boolean;
    show_date_time: boolean;
}

export const generateInvoiceTemplate = (transaction: Transaction, settings?: InvoiceSettings, assetBaseUrl?: string): string => {
    // Default settings fallback
    const defaultSettings: InvoiceSettings = {
        header_color: '#f97316',
        footer_color: '#f97316',
        table_header_color: '#f97316',
        primary_font: 'Arial',
        font_size_base: 12,
        font_weight: '400',
        logo_width: 90,
        logo_height: 90,
        company_title: 'INVOICE',
        company_name: 'Haji Printing',
        company_address: 'Erbil-Ehsa Street, Near Sarhad Stationery',
        company_phone_1: '0751 446 39 59',
        company_phone_2: '0751 447 39 59',
        company_email: 'info@hajiprinting.com',
        company_website: 'www.hajiprinting.com',
        header_height: 60,
        footer_height: 40,
        show_logo: true,
        show_company_info: true,
        show_date_time: true
    };

    const finalSettings = { ...defaultSettings, ...settings };

    // Get dynamic asset URL or fallback to detection
    const getAssetUrl = (path: string) => {
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        if (assetBaseUrl) {
            return `${assetBaseUrl}/${cleanPath}`;
        }

        // Fallback: detect from current location
        const currentPath = window.location.pathname;
        const subdirectoryMatch = currentPath.match(/^(\/[^/]+\/public)/);

        if (subdirectoryMatch) {
            return `${window.location.origin}${subdirectoryMatch[1]}/${cleanPath}`;
        } else {
            return `${window.location.origin}/${cleanPath}`;
        }
    };
    // Escape HTML but preserve UTF-8 characters (don't encode Arabic/Kurdish)
    const escapeHtml = (text: string | null | undefined): string => {
        if (!text) return '';
        // Only escape HTML special characters, preserve Unicode characters
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const dateStr = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const timeStr = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        return `${dateStr} at ${timeStr}`;
    };

    return `<?xml encoding="UTF-8"?>
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${transaction.order_id}</title>
        <style>
            @font-face {
                font-family: 'NotoSansArabic-Regular';
                src: url('${getAssetUrl('fonts/NotoSansArabic-Regular.ttf')}') format('truetype');
                font-weight: normal;
                font-style: normal;
            }
            @font-face {
                font-family: 'NotoSansArabic-Regular';
                src: url('${getAssetUrl('fonts/NotoSansArabic-Bold.ttf')}') format('truetype');
                font-weight: bold;
                font-style: normal;
            }
            @page {
                size: A4;
                margin: 0;
            }

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'NotoSansArabic-Regular', 'DejaVu Sans', ${finalSettings.primary_font}, sans-serif;
                background: white;
                color: #000;
                font-size: ${finalSettings.font_size_base}px;
                font-weight: ${finalSettings.font_weight || '400'};
                line-height: 1.2;
                position: relative;
                direction: ltr;
                unicode-bidi: embed;
            }
            
            /* Ensure Arabic/Kurdish text displays correctly */
            * {
                font-family: 'NotoSansArabic-Regular', 'DejaVu Sans', ${finalSettings.primary_font}, sans-serif;
            }
            
            /* Force UTF-8 encoding for all text elements */
            td, th, div, p, span, strong, small {
                font-family: 'NotoSansArabic-Regular', 'DejaVu Sans', ${finalSettings.primary_font}, sans-serif;
            }
            
            /* Fix reversed Arabic/Kurdish text - use embed with RTL direction */
            /* Note: DomPDF needs explicit direction: rtl with embed for proper RTL text handling */
            
            /* RTL text containers */
            [dir="rtl"] {
                direction: rtl !important;
                unicode-bidi: embed !important;
                text-align: right !important;
            }
            
            /* Ensure RTL spans display correctly */
            span[dir="rtl"] {
                display: inline-block !important;
                direction: rtl !important;
                unicode-bidi: embed !important;
            }

            .invoice-container {
                width: 210mm;
                min-height: 297mm;
                background: white;
                margin: 0;
                padding: 0;
            }

            .header {
                background: ${finalSettings.header_color};
                height: ${finalSettings.header_height}px;
                width: 100%;
                position: relative;
            }

            .footer {
                background: ${finalSettings.footer_color};
                height: ${finalSettings.footer_height}px;
                width: 100%;
                position: absolute;
                bottom: 0;
            }

            .content {
                padding: 20px 40px;
                min-height: calc(297mm - 100px);
            }

            .invoice-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 30px;
                position: relative;
            }

            .company-info {
                flex: 1;
                max-width: 70%;
            }

            .company-title {
                font-size: ${finalSettings.font_size_base * 2}px;
                font-weight: bold;
                margin-bottom: 5px;
            }

            .company-name {
                font-size: ${finalSettings.font_size_base * 1.33}px;
                font-weight: bold;
                margin-bottom: 8px;
            }

            .company-details {
                font-size: ${finalSettings.font_size_base * 0.92}px;
                line-height: 1.4;
                color: #333;
            }

            .logo-section {
                position: absolute;
                top: 0;
                right: 0;
                text-align: right;
                width: auto;
                height: auto;
            }

            .logo {
                width: ${finalSettings.logo_width}px;
                height: ${finalSettings.logo_height}px;
                background: transparent;
                border: none;
                display: block;
                overflow: visible;
            }

            .logo img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                display: block;
                background: transparent;
                border: none;
            }

            .invoice-meta {
                text-align: left;
                font-size: ${finalSettings.font_size_base * 0.83}px;
                line-height: 1.4;
                max-width: 140px;
                margin-top: 15px;
            }

            .invoice-meta div {
                margin-bottom: 3px;
                word-wrap: break-word;
            }

            .invoice-meta div:first-child {
                font-size: ${finalSettings.font_size_base * 0.75}px;
                line-height: 1.2;
            }

            .customer-section {
                margin-bottom: 25px;
            }

            .customer-label {
                font-size: ${finalSettings.font_size_base}px;
                font-weight: bold;
                margin-bottom: 5px;
            }

            .customer-info {
                font-size: ${finalSettings.font_size_base * 0.92}px;
            }

            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }

            .items-table th {
                background: ${finalSettings.table_header_color};
                color: white;
                padding: 8px 6px;
                text-align: left;
                font-size: ${finalSettings.font_size_base * 0.92}px;
                font-weight: bold;
            }

            .items-table td {
                padding: 6px;
                border-bottom: 1px solid #e0e0e0;
                font-size: ${finalSettings.font_size_base * 0.92}px;
                vertical-align: top;
            }

            .items-table tbody tr:nth-child(even) {
                background-color: #f8f9ff;
            }

            .text-center {
                text-align: center;
            }

            .text-right {
                text-align: right;
            }

            .totals-section {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-top: 20px;
            }


            .totals-right {
                flex: 0 0 auto;
            }

            .totals-table {
                border: 1px solid #ddd;
                min-width: 200px;
                margin-left: auto;
            }

            .totals-table tr td {
                padding: 5px 8px;
                font-size: ${finalSettings.font_size_base * 0.92}px;
                border-bottom: 1px solid #eee;
            }

            .totals-table tr:last-child td {
                border-bottom: none;
                background: ${finalSettings.table_header_color};
                color: white;
                font-weight: bold;
            }


            /* Print styles */
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            <div class="header"></div>

            <div class="content">
                <div class="invoice-header">
                    <div class="company-info">
                        <div class="company-title">${transaction.type === 'offer' ? 'PRICE OFFER' : finalSettings.company_title}</div>
                        <div class="company-name">${finalSettings.company_name}</div>
                        ${finalSettings.show_company_info ? `
                        <div class="company-details">
                            ${finalSettings.company_address ? `${finalSettings.company_address}<br>` : ''}
                            ${finalSettings.company_phone_1 ? `${finalSettings.company_phone_1}<br>` : ''}
                            ${finalSettings.company_phone_2 ? `${finalSettings.company_phone_2}<br>` : ''}
                            ${finalSettings.company_email ? `Email: ${finalSettings.company_email}<br>` : ''}
                            ${finalSettings.company_website ? finalSettings.company_website : ''}
                        </div>
                        ` : ''}
                        ${finalSettings.show_date_time ? `
                        <div class="invoice-meta">
                            <div>${formatDateTime(transaction.transaction_date)}</div>
                            <div><strong>${transaction.type === 'offer' ? 'Offer ID#:' : 'Invoice ID#:'}</strong></div>
                            <div>${transaction.order_id}</div>
                        </div>
                        ` : ''}
                    </div>

                    ${finalSettings.show_logo ? `
                    <div class="logo-section">
                        <div class="logo" style="width: ${finalSettings.logo_width}px; height: ${finalSettings.logo_height}px;">
                            <img src="${finalSettings.logo_url || getAssetUrl('images/hajiNoBackground.png')}" alt="Company Logo">
                        </div>
                    </div>
                    ` : ''}
                </div>

                <div class="customer-section">
                    <div class="customer-label">Customer Name: ${transaction.customer.name}</div>
                    <div class="customer-info">
                        ${transaction.customer.email ? `Email: ${transaction.customer.email}` : ''}${transaction.customer.email && transaction.customer.phone ? ' | ' : ''}${transaction.customer.phone ? `Phone: ${transaction.customer.phone}` : ''}
                    </div>
                </div>

                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th class="text-center" style="width: 60px;">Qty</th>
                            <th class="text-center" style="width: 80px;">Price</th>
                            <th class="text-center" style="width: 70px;">Discount</th>
                            <th class="text-right" style="width: 80px;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${transaction.items.map((item) => {
                            // Detect if text contains Arabic/Kurdish characters
                            const hasRTL = /[\u0600-\u06FF]/.test(item.name || '');

                            // Wrap Arabic/Kurdish text in RTL span for proper direction
                            let displayName = escapeHtml(item.name);
                            if (hasRTL) {
                                // Split text to preserve non-Arabic parts and wrap each part with proper direction
                                const parts = displayName.split(/([\u0600-\u06FF]+)/);
                                displayName = parts.map(part => {
                                    if (/[\u0600-\u06FF]/.test(part)) {
                                        // Arabic/Kurdish: use embed (NOT bidi-override) to let bidirectional algorithm work naturally
                                        return `<span dir="rtl" style="direction: rtl; unicode-bidi: embed; display: inline-block;">${part}</span>`;
                                    } else if (part.trim()) {
                                        // LTR text: wrap in LTR span to isolate direction
                                        return `<span dir="ltr" style="direction: ltr; unicode-bidi: embed; display: inline-block;">${part}</span>`;
                                    }
                                    return part;
                                }).join('');
                            }

                            // Set entire cell to RTL with embed if it contains Arabic/Kurdish text
                            const rtlAttr = hasRTL ? ' dir="rtl" style="direction: rtl; unicode-bidi: embed; text-align: right;"' : '';

                            // Get item discount - could be a number or percentage
                            const itemDiscount = item.discount || 0;

                            return `
                        <tr>
                            <td${rtlAttr}>
                                <strong>${displayName}</strong><br>
                                <small>${item.type ? `${escapeHtml(item.type)}` : ''}${item.dimensions ? ` | Size: ${escapeHtml(item.dimensions)}` : ''}${item.weight ? ` | Weight: ${escapeHtml(item.weight)}` : ''}</small>
                            </td>
                            <td class="text-center">${item.quantity}</td>
                            <td class="text-center">${formatIQDWithSymbol(item.unit_price)}</td>
                            <td class="text-center">${itemDiscount > 0 ? formatIQDWithSymbol(itemDiscount) : '-'}</td>
                            <td class="text-right">${formatIQDWithSymbol(item.total)}</td>
                        </tr>
                        `;
                        }).join('')}
                    </tbody>
                </table>

                <div class="totals-section">

                    <div class="totals-right">
                        <table class="totals-table">
                            ${(() => {
                                // Calculate subtotal from items (unit_price * quantity, before discounts)
                                const calculatedSubtotal = transaction.subtotal > 0
                                    ? transaction.subtotal
                                    : transaction.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

                                // Total discount = subtotal - grand_total (this is the actual total discount applied)
                                const totalDiscount = calculatedSubtotal - transaction.grand_total;

                                if (transaction.type === 'offer') {
                                    return `
                                    <tr>
                                        <td>Subtotal :</td>
                                        <td class="text-right">${formatIQDWithSymbol(calculatedSubtotal)}</td>
                                    </tr>
                                    ${totalDiscount > 0 ? `
                                    <tr>
                                        <td>Discount :</td>
                                        <td class="text-right" style="color: #dc2626;">-${formatIQDWithSymbol(totalDiscount)}</td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td><strong>Total Offer :</strong></td>
                                        <td class="text-right"><strong>${formatIQDWithSymbol(transaction.grand_total)}</strong></td>
                                    </tr>
                                    `;
                                } else {
                                    return `
                                    <tr>
                                        <td>Subtotal :</td>
                                        <td class="text-right">${formatIQDWithSymbol(calculatedSubtotal)}</td>
                                    </tr>
                                    ${totalDiscount > 0 ? `
                                    <tr>
                                        <td>Discount :</td>
                                        <td class="text-right" style="color: #dc2626;">-${formatIQDWithSymbol(totalDiscount)}</td>
                                    </tr>
                                    ` : ''}
                                    ${transaction.status === 'debt' ? `
                                    <tr>
                                        <td>Status :</td>
                                        <td class="text-right" style="color: #dc2626; font-weight: bold;">DEBT</td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td><strong>Grand Total :</strong></td>
                                        <td class="text-right"><strong>${formatIQDWithSymbol(transaction.grand_total)}</strong></td>
                                    </tr>
                                    `;
                                }
                            })()}
                        </table>
                    </div>
                </div>
            </div>

            <div class="footer"></div>
        </div>
    </body>
    </html>
    `;
};