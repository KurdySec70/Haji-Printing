import { Button } from '@/components/ui/button';
import { useFullscreen } from '@/hooks/use-fullscreen';
import { Maximize, Minimize } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function FullscreenToggle() {
    const { isFullscreen, toggleFullscreen } = useFullscreen();
    const { t } = useTranslation();

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-9 w-9 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 text-gray-900 dark:text-gray-100 transition-colors duration-200"
            title={isFullscreen ? t('common.fullscreen.exit') : t('common.fullscreen.enter')}
        >
            {isFullscreen ? (
                <Minimize className="h-4 w-4" />
            ) : (
                <Maximize className="h-4 w-4" />
            )}
        </Button>
    );
}
