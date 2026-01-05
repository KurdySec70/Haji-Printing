import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import LanguageToggleDropdown from '@/components/language-dropdown';
import { FullscreenToggle } from '@/components/fullscreen-toggle';
import { type BreadcrumbItem as BreadcrumbItemType, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function MainHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { auth } = usePage<SharedData>().props;

    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] px-6 transition-all duration-200 ease-in-out group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 shadow-sm">
            {/* Left Section */}
            <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1 h-9 w-9 rounded-lg bg-[#F58E18] hover:bg-[#EA580C] text-white shadow-sm transition-colors duration-200" />
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            
            {/* Right Section */}
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
                        <Button variant="ghost" className="h-10 px-4 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#262626] text-gray-900 dark:text-white shadow-sm transition-colors duration-200 group">
                            <UserInfo user={auth.user} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2 shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a]">
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
