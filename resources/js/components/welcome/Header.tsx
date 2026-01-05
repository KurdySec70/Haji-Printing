import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { login } from '@/routes';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import LanguageToggleDropdown from '@/components/language-dropdown';
import { FullscreenToggle } from '@/components/fullscreen-toggle';
import { useAssetPath } from '@/hooks/useAssetPath';

interface HeaderProps {
  onLogoClick: () => void;
}

/**
 * Reusable header component for the welcome page
 * Maintains the exact same visual style and functionality
 */
export const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  const { auth } = usePage<SharedData>().props;
  const { t } = useTranslation();
  const { getLogoUrl } = useAssetPath();

  const getDashboardUrl = (role: string) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'cashier':
        return '/cashier/pos';
      case 'customer':
        return '/customer/dashboard';
      default:
        return '/admin/dashboard';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#0a0a0a] border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
      
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            <button 
              onClick={onLogoClick}
              className="flex items-center space-x-2 sm:space-x-3 hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-[#F58E18]/20 rounded-lg p-1 cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-orange-500 to-amber-500 p-0.5">
                <img
                  src={getLogoUrl()}
                  alt="Haji Logo"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {t('app.name')}
                </h1>
              </div>
            </button>
          </div>

          {/* Controls Section */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <FullscreenToggle />
            <LanguageToggleDropdown />
            <AppearanceToggleDropdown />
            
            {/* Divider */}
            <div className="w-px h-4 sm:h-5 md:h-6 bg-gray-200 dark:bg-gray-700"></div>
            
            {/* Login/Dashboard Button */}
            {auth.isAuthenticated ? (
              <Link
                href={getDashboardUrl((auth.user?.role as string) ?? 'admin')}
                className="inline-flex items-center px-5 py-2.5 md:px-6 md:py-3 bg-[#F58E18] text-white text-base font-medium rounded-lg hover:bg-[#EA580C] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F58E18]/20"
              >
                {t('common.dashboard')}
              </Link>
            ) : (
              <Link
                href={login()}
                className="inline-flex items-center px-5 py-2.5 md:px-6 md:py-3 bg-[#F58E18] text-white text-base font-medium rounded-lg hover:bg-[#EA580C] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F58E18]/20"
              >
                {t('welcome.getStarted')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
