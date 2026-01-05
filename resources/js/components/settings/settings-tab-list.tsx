import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Database, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SettingsTabList() {
    const { t } = useTranslation();
    
    return (
        <>
            <style>{`
                .settings-tab-trigger[data-state="active"] {
                    background-color: #F58E18 !important;
                }
            `}</style>
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 dark:bg-[#1c1917] p-1 rounded-lg">
                <TabsTrigger 
                    value="business" 
                    className="settings-tab-trigger flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#431407]/50"
                >
                    <Building2 className="w-4 h-4" />
                    <span>{t('settings.tabs.business')}</span>
                </TabsTrigger>
                
                <TabsTrigger 
                    value="backup" 
                    className="settings-tab-trigger flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#431407]/50"
                >
                    <Database className="w-4 h-4" />
                    <span>{t('settings.tabs.backup')}</span>
                </TabsTrigger>
                
                <TabsTrigger 
                    value="invoice-template" 
                    className="settings-tab-trigger flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#431407]/50"
                >
                    <FileText className="w-4 h-4" />
                    <span>{t('settings.tabs.invoiceTemplate')}</span>
                </TabsTrigger>
            </TabsList>
        </>
    );
}
