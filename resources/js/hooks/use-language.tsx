import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function useLanguage() {
    const { i18n } = useTranslation();

    useEffect(() => {
        // Check if language is saved in localStorage
        const savedLanguage = localStorage.getItem('i18nextLng');
        
        if (savedLanguage && ['en', 'ku', 'ar'].includes(savedLanguage)) {
            // If we have a saved language and it's valid, use it
            if (i18n.language !== savedLanguage) {
                i18n.changeLanguage(savedLanguage);
            }
        } else {
            // If no saved language, save the current language
            localStorage.setItem('i18nextLng', i18n.language);
        }
    }, [i18n]);

    const changeLanguage = (languageCode: string) => {
        i18n.changeLanguage(languageCode);
        localStorage.setItem('i18nextLng', languageCode);
    };

    return {
        currentLanguage: i18n.language,
        changeLanguage,
        isReady: i18n.isInitialized
    };
}
