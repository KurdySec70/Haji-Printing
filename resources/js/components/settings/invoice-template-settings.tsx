import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { FileText, Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Transaction } from '@/types';
import { InvoiceTemplateTabs } from './invoice-template-tabs';
import { InvoiceTemplateContent } from './invoice-template-content';
import { InvoicePreview } from './invoice-preview';

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

// Mock transaction for preview
const mockTransaction: Transaction = {
    id: 1,
    order_id: 'INV-2024-001',
    customer_id: 1,
    customer: {
        id: 1,
        name: 'John Doe',
        phone: '+964 750 123 4567',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    items: [
        {
            id: 1,
            name: 'Business Cards',
            quantity: 1000,
            unit_price: 50000,
            total: 50000,
            type: 'product'
        },
        {
            id: 2,
            name: 'Flyers',
            quantity: 500,
            unit_price: 20000,
            total: 100000,
            type: 'product'
        }
    ],
    subtotal: 150000,
    discount_amount: 0,
    grand_total: 150000,
    transaction_date: new Date().toISOString(),
    status: 'paid',
    type: 'transaction',
    notes: 'Sample invoice for testing',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
};

export function InvoiceTemplateSettings() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<string>('colors');
    const [settings, setSettings] = useState<InvoiceSettings>({
        header_color: '#f97316',
        footer_color: '#f97316',
        table_header_color: '#f97316',
        primary_font: 'Arial',
        font_size_base: 12,
        font_weight: '400',
        logo_width: 100,
        logo_height: 100,
        logo_url: '',
        company_title: 'Company',
        company_name: 'Your Company Name',
        company_address: 'Your Company Address',
        company_phone_1: '+964 750 123 4567',
        company_phone_2: '+964 750 987 6543',
        company_email: 'info@company.com',
        company_website: 'www.company.com',
        header_height: 60,
        footer_height: 40,
        show_logo: true,
        show_company_info: true,
        show_date_time: true
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);



    useEffect(() => {
        const loadSettings = async () => {
            setLoading(true);
            try {
                const response = await fetch('/admin/api/invoice-settings');
                const data = await response.json();
                if (data.settings) {
                    setSettings(data.settings);
                }
            } catch (error) {
                console.error('Failed to load settings:', error);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    // Scroll to top when activeTab changes
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    }, [activeTab]);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Logo is already uploaded in real-time, just save all settings
            const response = await fetch('/admin/api/invoice-settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ settings }),
            });
            
            if (response.ok) {
                const data = await response.json();
                setSettings(data.settings); // Update local state with saved data
                setSelectedFile(null); // Clear selected file
                setFilePreview(null); // Clear preview
                toast({
                    title: t('toast.success'),
                    description: t('settings.invoiceTemplate.settingsSaved'),
                    variant: "success",
                });
            } else {
                toast({
                    title: t('toast.error'),
                    description: t('settings.invoiceTemplate.failedToSave'),
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            toast({
                title: t('toast.error'),
                description: t('settings.invoiceTemplate.failedToSave'),
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleLogoUpload = (logoUrl: string) => {
        // Clear selected file and preview after successful upload
        // Note: logoUrl is required by callback signature but not used here
        setSelectedFile(null);
        setFilePreview(null);
    };

    const handleReset = async () => {
        try {
            setSaving(true);
            
            const response = await fetch('/admin/api/invoice-settings/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // No CSRF token needed
                },
            });
            
            const data = await response.json();
            
            if (data.success) {
                setSettings(data.settings);
                toast({
                    title: t('settings.invoiceTemplate.settingsReset'),
                    description: t('settings.invoiceTemplate.settingsResetDescription'),
                    variant: "success",
                });
            } else {
                toast({
                    title: t('settings.invoiceTemplate.failedToReset'),
                    description: data.message || t('settings.invoiceTemplate.failedToResetDescription'),
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Reset failed:', error);
            toast({
                title: t('settings.invoiceTemplate.failedToReset'),
                description: t('settings.invoiceTemplate.failedToResetDescription'),
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-white dark:bg-[#1c1917] border border-gray-200 dark:border-0 rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#F58E18] to-[#EA580C] rounded-lg flex items-center justify-center shadow-sm">
                            <FileText className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t('settings.invoiceTemplate.title')}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {t('settings.invoiceTemplate.description')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleReset}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1.5"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            {t('settings.invoiceTemplate.reset')}
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            size="sm"
                            className="flex items-center gap-1.5 bg-gradient-to-r from-[#F58E18] to-[#EA580C] hover:from-[#EA580C] hover:to-[#DC2626] text-white"
                        >
                            <Save className="w-3.5 h-3.5" />
                            {saving ? t('settings.invoiceTemplate.saving') : t('settings.invoiceTemplate.save')}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content - 2 Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
                {/* Settings Panel - Left Column */}
                <div ref={contentRef} className="lg:col-span-2 h-fit lg:h-[600px] overflow-y-auto">
                    {/* Tabs Section */}
                    <InvoiceTemplateTabs 
                        activeTab={activeTab} 
                        onTabChange={setActiveTab} 
                    />

                    {/* Content Section */}
                    <InvoiceTemplateContent 
                        activeTab={activeTab}
                        settings={settings}
                        onSettingsChange={(key, value) => setSettings(prev => ({ ...prev, [key]: value }))}
                        selectedFile={selectedFile}
                        onFileSelect={setSelectedFile}
                        onLogoUpload={handleLogoUpload}
                        filePreview={filePreview}
                        onFilePreviewChange={setFilePreview}
                    />
                                    </div>
                                    
                {/* Preview Panel - Right Column (Fitted) */}
                <div className="lg:col-span-3">
                    <InvoicePreview 
                        settings={settings}
                        transaction={mockTransaction}
                    />
                </div>
            </div>
        </div>
    );
}
