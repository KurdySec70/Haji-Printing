import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { generateInvoiceTemplate } from '@/utils/invoice-template';
import { Transaction } from '@/types';

interface InvoiceSettings {
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

interface InvoicePreviewProps {
    settings: InvoiceSettings;
    transaction: Transaction;
}

export function InvoicePreview({ settings, transaction }: InvoicePreviewProps) {
    const { t } = useTranslation();
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Generate preview HTML with current settings (includes real-time logo URL changes)
    const previewHtml = generateInvoiceTemplate(transaction, settings);

    // Update iframe content when settings change (real-time preview)
    useEffect(() => {
        if (iframeRef.current) {
            const iframe = iframeRef.current;
            const doc = iframe.contentDocument || iframe.contentWindow?.document;
            
            if (doc) {
                doc.open();
                doc.write(previewHtml);
                doc.close();
            }
        }
    }, [previewHtml, settings]);

    const handlePrintPreview = () => {
        if (iframeRef.current) {
            iframeRef.current.contentWindow?.print();
        }
    };

    return (
        <Card className="bg-white dark:bg-[#1c1917] border border-gray-200 dark:border-gray-700 shadow-sm w-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <CardTitle className="text-base text-gray-900 dark:text-white">
                            {t('settings.invoiceTemplate.livePreview')}
                        </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrintPreview}
                            className="px-3 py-1.5 text-xs bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors cursor-pointer"
                        >
                            Print Preview
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="w-full bg-gray-50 dark:bg-gray-800 p-4">
                    <div className="w-full max-w-[210mm] mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                        <div 
                            className="w-full"
                            style={{
                                aspectRatio: '210/297', // A4 ratio
                                minHeight: '297mm',
                                maxHeight: '297mm'
                            }}
                        >
                            <iframe
                                ref={iframeRef}
                                className="w-full h-full border-0"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    background: 'white'
                                }}
                                title="Invoice Preview"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
