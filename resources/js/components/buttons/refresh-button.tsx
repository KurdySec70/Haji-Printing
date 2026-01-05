import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface RefreshButtonProps {
    onRefresh: () => void | Promise<void>;
    className?: string;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive' | 'green' | 'greenOutline' | 'red' | 'redOutline' | 'orange' | 'orangeOutline' | 'purple' | 'purpleOutline' | 'yellow' | 'yellowOutline' | 'pink' | 'pinkOutline' | 'blue' | 'blueOutline';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    disabled?: boolean;
    showProgress?: boolean;
}

export default function RefreshButton({
    onRefresh,
    className = '',
    variant = 'blueOutline',
    size = 'default',
    disabled = false,
    showProgress = true
}: RefreshButtonProps) {
    const { t } = useTranslation();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        if (isRefreshing) return;

        setIsRefreshing(true);
        try {
            const result = onRefresh();
            // Handle both sync and async refresh functions
            if (result instanceof Promise) {
                await result;
            }
        } catch {
            console.error('Refresh failed');
        } finally {
            // Add a minimum delay to show loading state for better UX
            const minDelay = showProgress ? 800 : 300;
            setTimeout(() => {
                setIsRefreshing(false);
            }, minDelay);
        }
    };

    return (
        <Button
            onClick={handleRefresh}
            variant={variant}
            size={size}
            className={`transition-all duration-300 ease-out hover:scale-105 hover:shadow-md transform ${className}`}
            disabled={disabled || isRefreshing}
        >
            <RefreshCw className={`w-4 h-4 mr-2 transition-transform duration-300 ${isRefreshing ? 'animate-spin' : 'hover:rotate-180'}`} />
            {isRefreshing ? (
                <span className="flex items-center">
                    {t('common.buttons.refreshing')}
                    {showProgress && (
                        <span className="ml-1 text-xs opacity-70">
                            (updating all data...)
                        </span>
                    )}
                </span>
            ) : (
                t('common.buttons.refresh')
            )}
        </Button>
    );
}
