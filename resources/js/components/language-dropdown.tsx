import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/use-language';

export default function LanguageToggleDropdown({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { i18n, t } = useTranslation();
    const { changeLanguage } = useLanguage();

    const languages = [
        { code: 'en', name: t('common.languages.en'), flag: 'EN' },
        { code: 'ku', name: t('common.languages.ku'), flag: 'KU' },
        { code: 'ar', name: t('common.languages.ar'), flag: 'AR' },
    ];

    // const getCurrentLanguage = () => {
    //     return languages.find(lang => lang.code === i18n.language) || languages[0];
    // };

    const handleLanguageChange = (languageCode: string) => {
        changeLanguage(languageCode);
    };

    return (
        <div className={className} {...props}>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md shadow-sm hover:shadow-md transition-all duration-200 hover:bg-orange-100 dark:hover:bg-[#431407] hover:text-orange-600 dark:hover:text-[#fed7aa]">
                        <Globe className="h-4 w-4" />
                        <span className="sr-only">{t('common.navigation.language')}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
                    {languages.map((language) => (
                        <DropdownMenuItem 
                            key={language.code}
                            onClick={() => handleLanguageChange(language.code)}
                            className="cursor-pointer hover:!bg-orange-50 dark:hover:!bg-[#431407] hover:!text-orange-700 dark:hover:!text-[#fed7aa] transition-colors duration-200 focus:!bg-orange-50 dark:focus:!bg-[#431407] focus:!text-orange-700 dark:focus:!text-[#fed7aa]"
                        >
                             <span className="flex items-center gap-3 w-full">
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
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
