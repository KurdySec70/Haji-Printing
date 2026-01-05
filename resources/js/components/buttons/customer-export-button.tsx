import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { exportCustomersToCSV, type ExportableCustomer } from '@/lib/csv-export';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface CustomerExportButtonProps {
    customers: ExportableCustomer[];
    filename?: string;
    className?: string;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive' | 'green' | 'greenOutline' | 'red' | 'redOutline' | 'orange' | 'orangeOutline' | 'purple' | 'purpleOutline' | 'yellow' | 'yellowOutline' | 'pink' | 'pinkOutline';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    disabled?: boolean;
}

export default function CustomerExportButton({
    customers,
    filename,
    className = '',
    variant = 'purple',
    size = 'default',
    disabled = false
}: CustomerExportButtonProps) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        if (customers.length === 0) {
            toast({
                title: t('toast.error'),
                description: t('export.noCustomersToExport'),
                variant: "destructive",
            });
            return;
        }

        setIsExporting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing time
            
            exportCustomersToCSV(customers, filename);
            
            toast({
                title: t('toast.success'),
                description: t('export.customersExportedSuccessfully'),
                variant: "success",
            });
        } catch {
            toast({
                title: t('toast.error'),
                description: t('export.exportFailed'),
                variant: "destructive",
            });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button
            onClick={handleExport}
            disabled={disabled || isExporting || customers.length === 0}
            variant={variant}
            size={size}
            className={`relative overflow-hidden transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg transform group ${className}`}
        >
            <div className="flex items-center gap-2">
                {isExporting ? (
                    <FileSpreadsheet className="w-4 h-4 animate-pulse" />
                ) : (
                    <Download className="w-4 h-4 group-hover:scale-110 transition-transform duration-300 ease-out" />
                )}
                <span className="font-medium">
                    {isExporting ? t('export.exporting') : t('export.exportCSV')}
                </span>
            </div>
            
            {/* Loading overlay */}
            {isExporting && (
                <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </Button>
    );
}
