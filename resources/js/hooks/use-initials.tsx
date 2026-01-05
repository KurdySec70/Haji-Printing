import { useCallback } from 'react';

export function useInitials() {
    return useCallback((fullName: string): string => {
        const trimmedName = fullName.trim();

        if (trimmedName.length === 0) return '';
        
        return trimmedName.charAt(0).toUpperCase();
    }, []);
}
