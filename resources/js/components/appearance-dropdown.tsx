import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';
import { Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';

export default function AppearanceToggleDropdown({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();
    const { t } = useTranslation();

    const getCurrentIcon = () => {
        switch (appearance) {
            case 'dark':
                return <Moon className="h-5 w-5" />;
            case 'light':
                return <Sun className="h-5 w-5" />;
            default:
                return <Monitor className="h-5 w-5" />;
        }
    };

    return (
        <div className={className} {...props}>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md shadow-sm hover:shadow-md transition-all duration-200 hover:bg-purple-100 dark:hover:bg-[#431407] hover:text-purple-600 dark:hover:text-[#fed7aa]">
                        {getCurrentIcon()}
                        <span className="sr-only">{t('common.navigation.appearance')}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
                    <DropdownMenuItem 
                        onClick={() => updateAppearance('light')}
                        className="cursor-pointer hover:!bg-purple-50 dark:hover:!bg-[#431407] hover:!text-purple-700 dark:hover:!text-[#fed7aa] transition-colors duration-200 focus:!bg-purple-50 dark:focus:!bg-[#431407] focus:!text-purple-700 dark:focus:!text-[#fed7aa]"
                    >
                        <span className="flex items-center gap-2">
                            <Sun className="h-5 w-5" />
                            {t('common.appearance.light')}
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={() => updateAppearance('dark')}
                        className="cursor-pointer hover:!bg-purple-50 dark:hover:!bg-[#431407] hover:!text-purple-700 dark:hover:!text-[#fed7aa] transition-colors duration-200 focus:!bg-purple-50 dark:focus:!bg-[#431407] focus:!text-purple-700 dark:focus:!text-[#fed7aa]"
                    >
                        <span className="flex items-center gap-2">
                            <Moon className="h-5 w-5" />
                            {t('common.appearance.dark')}
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={() => updateAppearance('system')}
                        className="cursor-pointer hover:!bg-purple-50 dark:hover:!bg-[#431407] hover:!text-purple-700 dark:hover:!text-[#fed7aa] transition-colors duration-200 focus:!bg-purple-50 dark:focus:!bg-[#431407] focus:!text-purple-700 dark:focus:!text-[#fed7aa]"
                    >
                        <span className="flex items-center gap-2">
                            <Monitor className="h-5 w-5" />
                            {t('common.appearance.system')}
                        </span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
