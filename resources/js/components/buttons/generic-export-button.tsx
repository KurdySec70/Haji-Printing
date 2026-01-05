import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface GenericExportButtonProps<T = Record<string, unknown>> {
    data: T[];
    filename?: string;
    headers?: string[];
    getRowData?: (item: T) => string[];
    className?: string;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive' | 'green' | 'greenOutline' | 'red' | 'redOutline' | 'orange' | 'orangeOutline' | 'purple' | 'purpleOutline' | 'yellow' | 'yellowOutline' | 'pink' | 'pinkOutline';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    disabled?: boolean;
    emptyMessage?: string;
    successMessage?: string;
}

export default function GenericExportButton<T = Record<string, unknown>>({
    data,
    filename = 'export.csv',
    headers = [],
    getRowData,
    className = '',
    variant = 'purple',
    size = 'default',
    disabled = false,
    emptyMessage = 'No data to export',
    successMessage = 'Data exported successfully'
}: GenericExportButtonProps<T>) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [isExporting, setIsExporting] = useState(false);

    const exportToCSV = (data: T[], headers: string[], getRowData: (item: T) => string[], filename: string) => {
        if (!data || data.length === 0) {
            throw new Error('No data to export');
        }

        // Create CSV content
        let csvContent = '';
        
        // Add headers
        if (headers.length > 0) {
            csvContent += headers.join(',') + '\n';
        }
        
        // Add data rows
        data.forEach(item => {
            const rowData = getRowData ? getRowData(item) : Object.values(item as Record<string, unknown>);
            // Escape commas and quotes in CSV
            const escapedRowData = rowData.map(cell => {
                const cellStr = String(cell || '');
                if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                    return `"${cellStr.replace(/"/g, '""')}"`;
                }
                return cellStr;
            });
            csvContent += escapedRowData.join(',') + '\n';
        });

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExport = async () => {
        if (!data || data.length === 0) {
            toast({
                title: t('toast.error'),
                description: emptyMessage,
                variant: 'destructive',
            });
            return;
        }

        setIsExporting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UX
            exportToCSV(data, headers, getRowData || (() => []), filename);
            
            toast({
                title: t('toast.success'),
                description: successMessage,
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
            disabled={disabled || isExporting || !data || data.length === 0}
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
