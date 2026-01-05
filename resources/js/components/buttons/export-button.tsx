import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { exportProductsToCSV, type ExportableProduct } from '@/lib/csv-export';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface ExportButtonProps {
    products: ExportableProduct[];
    filename?: string;
    className?: string;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive' | 'green' | 'greenOutline' | 'red' | 'redOutline' | 'orange' | 'orangeOutline' | 'purple' | 'purpleOutline' | 'yellow' | 'yellowOutline' | 'pink' | 'pinkOutline';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    disabled?: boolean;
}

export default function ExportButton({
    products,
    filename,
    className = '',
    variant = 'purple',
    size = 'default',
    disabled = false
}: ExportButtonProps) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        if (products.length === 0) {
            toast({
                title: t('toast.error'),
                description: t('export.noProducts'),
                variant: 'destructive',
            });
            return;
        }

        setIsExporting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UX
            exportProductsToCSV(products, filename);
            
            toast({
                title: t('toast.success'),
                description: t('export.success', { count: products.length }),
                variant: 'success',
            });
        } catch {
            toast({
                title: t('toast.error'),
                description: t('export.failed'),
                variant: 'destructive',
            });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button
            onClick={handleExport}
            variant={variant}
            size={size}
            className={`transition-all duration-300 ease-out hover:scale-105 hover:shadow-md transform ${className}`}
            disabled={disabled || isExporting || products.length === 0}
        >
            {isExporting ? (
                <>
                    <Download className="w-4 h-4 mr-2 animate-pulse" />
                    {t('export.exporting')}
                </>
            ) : (
                <>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    {t('export.exportCSV')}
                </>
            )}
        </Button>
    );
}
