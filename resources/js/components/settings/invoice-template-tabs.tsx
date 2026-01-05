import React from 'react';
import { useTranslation } from 'react-i18next';
import { Palette, Type, Image, Building2, Settings } from 'lucide-react';

interface InvoiceTemplateTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function InvoiceTemplateTabs({ activeTab, onTabChange }: InvoiceTemplateTabsProps) {
    const { t } = useTranslation();

    return (
        <div className="sticky top-0 pb-3 z-10 mb-4">
                <div className="grid w-full grid-cols-3 sm:grid-cols-5 mb-0 bg-gray-100 dark:bg-[#1c1917] p-0.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <button 
                    className={`flex items-center gap-1.5 text-xs px-2 py-2 rounded-md transition-all duration-200 cursor-pointer ${
                        activeTab === 'colors' 
                            ? 'bg-orange-500 text-white' 
                            : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => onTabChange('colors')}
                >
                    <Palette className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs font-medium">{t('settings.invoiceTemplate.colors')}</span>
                </button>
                <button 
                    className={`flex items-center gap-1.5 text-xs px-2 py-2 rounded-md transition-all duration-200 cursor-pointer ${
                        activeTab === 'typography' 
                            ? 'bg-orange-500 text-white' 
                            : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => onTabChange('typography')}
                >
                    <Type className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs font-medium">{t('settings.invoiceTemplate.typography')}</span>
                </button>
                <button 
                    className={`flex items-center gap-1.5 text-xs px-2 py-2 rounded-md transition-all duration-200 cursor-pointer ${
                        activeTab === 'logo' 
                            ? 'bg-orange-500 text-white' 
                            : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => onTabChange('logo')}
                >
                    <Image className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs font-medium">{t('settings.invoiceTemplate.logo')}</span>
                </button>
                <button 
                    className={`flex items-center gap-1.5 text-xs px-2 py-2 rounded-md transition-all duration-200 cursor-pointer ${
                        activeTab === 'company' 
                            ? 'bg-orange-500 text-white' 
                            : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => onTabChange('company')}
                >
                    <Building2 className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs font-medium">{t('settings.invoiceTemplate.company')}</span>
                </button>
                <button 
                    className={`flex items-center gap-1.5 text-xs px-2 py-2 rounded-md transition-all duration-200 cursor-pointer ${
                        activeTab === 'content' 
                            ? 'bg-orange-500 text-white' 
                            : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => onTabChange('content')}
                >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs font-medium">{t('settings.invoiceTemplate.content')}</span>
                </button>
            </div>
        </div>
    );
}
