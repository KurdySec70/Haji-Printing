import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { AnimatedBackground } from './AnimatedBackground';

interface HeroSectionProps {
  isActive: boolean;
  onContactClick: () => void;
}

/**
 * Hero section component with animated background and call-to-action buttons
 * Maintains the exact same visual style as the original
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ 
  isActive, 
  onContactClick 
}) => {
  const { t } = useTranslation();

  const sectionClasses = `fixed inset-0 pt-20 bg-white dark:bg-[#0a0a0a] flex items-center transition-all duration-700 ease-in-out overflow-hidden ${
    isActive 
      ? 'opacity-100 translate-y-0 z-10' 
      : 'opacity-0 translate-y-full z-0'
  }`;

  return (
    <section className={sectionClasses}>
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-16 sm:py-20 md:py-24 w-full">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-4.5rem)] md:min-h-[calc(100vh-5rem)]">
          {/* Text Content */}
          <div className="space-y-6 sm:space-y-8 flex flex-col justify-center text-center max-w-4xl">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                {t('welcome.hero.title')}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#F58E18] to-[#EA580C] relative">
                  {t('welcome.hero.subtitle')}
                  {/* Text Glow Effect */}
                  <div className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-[#F58E18] to-[#EA580C] blur-sm opacity-50 animate-pulse"></div>
                </span>
              </h1>
              <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed relative max-w-2xl mx-auto lg:mx-0">
                <p className="relative z-10">
                  {t('welcome.hero.description')}
                </p>
                {/* Subtle text glow */}
                <div 
                  className="absolute inset-0 text-gray-600 dark:text-gray-300 blur-sm opacity-20 animate-pulse" 
                  style={{ animationDelay: '1s' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="absolute bottom-6 sm:bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col gap-3 sm:gap-4 items-center">
          {/* Contact Button */}
          <button
            onClick={onContactClick}
            className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300/50 cursor-pointer"
          >
            {t('welcome.hero.contactUs')}
          </button>

          {/* Posts Button */}
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#F58E18] text-white rounded-lg font-medium hover:bg-[#EA580C] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F58E18]/20 cursor-pointer"
          >
            <span className="hidden sm:inline">{t('welcome.hero.explorePosts')}</span>
            <span className="sm:hidden">{t('welcome.hero.posts')}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};
