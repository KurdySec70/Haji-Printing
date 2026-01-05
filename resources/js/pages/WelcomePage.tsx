import React from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useSectionNavigation } from '@/hooks/useSectionNavigation';
import { Header } from '@/components/welcome/Header';
import { HeroSection } from '@/components/welcome/HeroSection';
import { ContactSection } from '@/components/welcome/ContactSection';

/**
 * Main Welcome Page Component
 * 
 * This is a fully recoded version of the welcome page with:
 * - Modular component architecture
 * - Custom hooks for state management
 * - Reusable UI components
 * - Better TypeScript types
 * - Performance optimizations
 * - Same visual style as original
 */
export default function WelcomePage() {
  const { t } = useTranslation();
  const { 
    goToHero, 
    goToContact, 
    isHeroActive, 
    isContactActive 
  } = useSectionNavigation();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      <Head title={`${t('app.name')} - ${t('app.tagline')}`}>
        <meta name="description" content={`${t('app.name')} - ${t('app.description')}`} />
        <script type="module" src="https://unpkg.com/@splinetool/viewer@1.10.57/build/spline-viewer.js"></script>
        <style>{`
          body {
            background-color: #ffffff !important;
          }
          .dark body {
            background-color: #0a0a0a !important;
          }
          html {
            background-color: #ffffff !important;
          }
          html.dark {
            background-color: #0a0a0a !important;
          }
          spline-viewer {
            --spline-viewer-branding: none !important;
          }
          spline-viewer::part(branding) {
            display: none !important;
          }
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
          }
        `}</style>
      </Head>
      
      {/* Fixed Header */}
      <Header onLogoClick={goToHero} />

      {/* Main Content with Section Navigation */}
      <main className="relative overflow-hidden bg-white dark:bg-[#0a0a0a]">
        {/* Hero Section */}
        <HeroSection 
          isActive={isHeroActive} 
          onContactClick={goToContact} 
        />

        {/* Contact Section */}
        <ContactSection isActive={isContactActive} />
      </main>
    </div>
  );
}
