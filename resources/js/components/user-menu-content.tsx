import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, Globe, Sun, Moon, Monitor } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppearance } from '@/hooks/use-appearance';
import { useLanguage } from '@/hooks/use-language';

interface UserMenuContentProps {
    user: User | null;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const { t, i18n } = useTranslation();
    const { updateAppearance } = useAppearance();
    const { changeLanguage } = useLanguage();
    
    const cleanup = useMobileNavigation();
    
    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    const languages = [
        { code: 'en', name: t('common.languages.en'), flag: 'EN' },
        { code: 'ku', name: t('common.languages.ku'), flag: 'KU' },
        { code: 'ar', name: t('common.languages.ar'), flag: 'AR' },
    ];

    // const getCurrentLanguage = () => {
    //     return languages.find(lang => lang.code === i18n.language) || languages[0];
    // };

    // const getCurrentThemeIcon = () => {
    //     switch (appearance) {
    //         case 'dark':
    //             return <Moon className="h-4 w-4" />;
    //         case 'light':
    //             return <Sun className="h-4 w-4" />;
    //         default:
    //             return <Monitor className="h-4 w-4" />;
    //     }
    // };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    {user ? (
                        <UserInfo user={user} showEmail={true} />
                    ) : (
                        <div className="flex flex-col text-gray-500 dark:text-gray-400">
                            <span className="font-medium text-sm">
                                {t('common.loading')}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                {t('common.navigation.profile')}
                            </span>
                        </div>
                    )}
                </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            
            {/* Mobile Controls - Theme and Language */}
            <div className="sm:hidden">
                {/* Theme Toggle */}
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">
                        {t('common.navigation.appearance')}
                    </DropdownMenuLabel>
                    <DropdownMenuItem 
                        onClick={() => updateAppearance('light')}
                        className="cursor-pointer hover:!bg-purple-50 dark:hover:!bg-[#431407] hover:!text-purple-700 dark:hover:!text-[#fed7aa] transition-colors duration-200 focus:!bg-purple-50 dark:focus:!bg-[#431407] focus:!text-purple-700 dark:focus:!text-[#fed7aa]"
                    >
                        <Sun className="mr-2 h-4 w-4" />
                        {t('common.appearance.light')}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={() => updateAppearance('dark')}
                        className="cursor-pointer hover:!bg-purple-50 dark:hover:!bg-[#431407] hover:!text-purple-700 dark:hover:!text-[#fed7aa] transition-colors duration-200 focus:!bg-purple-50 dark:focus:!bg-[#431407] focus:!text-purple-700 dark:focus:!text-[#fed7aa]"
                    >
                        <Moon className="mr-2 h-4 w-4" />
                        {t('common.appearance.dark')}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={() => updateAppearance('system')}
                        className="cursor-pointer hover:!bg-purple-50 dark:hover:!bg-[#431407] hover:!text-purple-700 dark:hover:!text-[#fed7aa] transition-colors duration-200 focus:!bg-purple-50 dark:focus:!bg-[#431407] focus:!text-purple-700 dark:focus:!text-[#fed7aa]"
                    >
                        <Monitor className="mr-2 h-4 w-4" />
                        {t('common.appearance.system')}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                {/* Language Toggle */}
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">
                        {t('settings.sections.language')}
                    </DropdownMenuLabel>
                    {languages.map((language) => (
                        <DropdownMenuItem 
                            key={language.code}
                            onClick={() => changeLanguage(language.code)}
                            className="cursor-pointer hover:!bg-orange-50 dark:hover:!bg-[#431407] hover:!text-orange-700 dark:hover:!text-[#fed7aa] transition-colors duration-200 focus:!bg-orange-50 dark:focus:!bg-[#431407] focus:!text-orange-700 dark:focus:!text-[#fed7aa]"
                        >
                            <Globe className="mr-2 h-4 w-4" />
                            <span className="flex items-center gap-2 w-full">
                                <span className="text-sm font-semibold">{language.flag}</span>
                                <span className={`font-sans ${language.code === 'ku' || language.code === 'ar' ? 'text-kurdish' : ''}`}>
                                    {language.name}
                                </span>
                                {i18n.language === language.code && (
                                    <span className="ml-auto text-xs text-muted-foreground">✓</span>
                                )}
                            </span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
            </div>
            
            {/* Logout - Always visible */}
            <DropdownMenuItem asChild>
                <Link className="block w-full cursor-pointer hover:!bg-red-50 dark:hover:!bg-[#431407] hover:!text-red-700 dark:hover:!text-[#fed7aa] transition-colors duration-200 focus:!bg-red-50 dark:focus:!bg-[#431407] focus:!text-red-700 dark:focus:!text-[#fed7aa]" href={logout()} as="button" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('components.user.logout')}
                </Link>
            </DropdownMenuItem>
        </>
    );
}
