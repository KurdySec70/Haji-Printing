import { useState, useEffect, useCallback } from 'react';

export type SectionType = 'hero' | 'contact';

export interface UseSectionNavigationReturn {
  currentSection: SectionType;
  goToHero: () => void;
  goToContact: () => void;
  isHeroActive: boolean;
  isContactActive: boolean;
}

/**
 * Custom hook for managing section navigation in the welcome page
 * Handles section transitions and body scroll management
 */
export function useSectionNavigation(): UseSectionNavigationReturn {
  const [currentSection, setCurrentSection] = useState<SectionType>('hero');

  // Disable scrolling on component mount
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const goToHero = useCallback(() => {
    setCurrentSection('hero');
  }, []);

  const goToContact = useCallback(() => {
    setCurrentSection('contact');
  }, []);

  return {
    currentSection,
    goToHero,
    goToContact,
    isHeroActive: currentSection === 'hero',
    isContactActive: currentSection === 'contact',
  };
}
