import { Breadcrumbs } from '@/components/breadcrumbs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import LanguageToggleDropdown from '@/components/language-dropdown';
import { FullscreenToggle } from '@/components/fullscreen-toggle';
import { type BreadcrumbItem as BreadcrumbItemType, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useAssetPath } from '@/hooks/useAssetPath';

export function CashierHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();
    const { getLogoUrl } = useAssetPath();

    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] px-6 w-full">
            {/* Left Section - Logo and Breadcrumbs */}
            <div className="flex items-center gap-3">
                {/* System Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm">
                        <img
                            src={getLogoUrl()}
                            alt="Haji Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white hidden sm:block">
                            {t('admin.brandName')}
                        </span>
                    </div>
                </div>
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            
            {/* Right Section - Controls */}
            <div className="ml-auto flex items-center gap-2">
                {/* Fullscreen Toggle */}
                <div className="hidden sm:block">
                    <FullscreenToggle />
                </div>
                
                {/* Language Toggle */}
                <div className="hidden sm:block">
                    <LanguageToggleDropdown />
                </div>
                
                {/* Theme Toggle */}
                <div className="hidden sm:block">
                    <AppearanceToggleDropdown />
                </div>
                
                {/* Separator */}
                <div className="hidden sm:block h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
                
                {/* User Profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-10 px-4 rounded-lg bg-orange-100 dark:bg-[#1c1917] hover:bg-orange-200 dark:hover:bg-[#431407] hover:text-orange-700 dark:hover:text-[#fed7aa] text-gray-900 dark:text-[#fed7aa] shadow-sm transition-all duration-200 group">
                            <UserInfo user={auth.user} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2 shadow-lg border border-gray-200 dark:border-gray-700">
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
