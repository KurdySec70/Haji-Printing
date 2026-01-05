import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { PerformanceUtils } from '@/lib/performance-config';

/**
 * Hook for monitoring navigation performance
 */
export function usePerformanceMonitor() {
    const page = usePage();
    const navigationStart = useRef<number>(0);
    const lastUrl = useRef<string>('');

    useEffect(() => {
        const currentUrl = window.location.pathname;
        
        // Track navigation start time
        if (lastUrl.current !== currentUrl) {
            navigationStart.current = performance.now();
            lastUrl.current = currentUrl;
        }

        // Track page load completion
        const trackPageLoad = () => {
            if (navigationStart.current > 0) {
                const loadTime = performance.now() - navigationStart.current;
                
                // Log performance metrics in development
                if (process.env.NODE_ENV === 'development') {
                    console.log(`[Performance] Page load: ${loadTime.toFixed(2)}ms - ${currentUrl}`);
                }
                
                // Reset navigation start
                navigationStart.current = 0;
            }
        };

        // Track when page is fully loaded
        if (document.readyState === 'complete') {
            trackPageLoad();
        } else {
            window.addEventListener('load', trackPageLoad);
            return () => window.removeEventListener('load', trackPageLoad);
        }
    }, [page.url]);

    return {
        measureNavigation: (name: string, fn: () => void) => {
            return PerformanceUtils.measure(name, fn);
        }
    };
}

/**
 * Hook for monitoring component render performance
 */
export function useRenderMonitor(componentName: string) {
    const renderStart = useRef<number>(0);

    useEffect(() => {
        renderStart.current = performance.now();
        
        return () => {
            const renderTime = performance.now() - renderStart.current;
            
            if (process.env.NODE_ENV === 'development' && renderTime > 10) {
                console.log(`[Performance] ${componentName} render: ${renderTime.toFixed(2)}ms`);
            }
        };
    });

    return {
        measureRender: (fn: () => void) => {
            const start = performance.now();
            fn();
            const end = performance.now();
            
            if (process.env.NODE_ENV === 'development') {
                console.log(`[Performance] ${componentName} operation: ${(end - start).toFixed(2)}ms`);
            }
        }
    };
}

/**
 * Hook for debounced search
 */
export function useDebouncedSearch(
    searchFn: (query: string) => void,
    delay: number = 300
) {
    const debouncedSearch = PerformanceUtils.debounce(searchFn as (...args: unknown[]) => unknown, delay) as (query: string) => void;
    
    return {
        search: debouncedSearch,
        immediate: searchFn
    };
}

/**
 * Hook for throttled scroll events
 */
export function useThrottledScroll(
    scrollFn: (event: Event) => void,
    limit: number = 100
) {
    const throttledScroll = PerformanceUtils.throttle(scrollFn as (...args: unknown[]) => unknown, limit) as (event: Event) => void;
    
    useEffect(() => {
        window.addEventListener('scroll', throttledScroll, { passive: true });
        return () => window.removeEventListener('scroll', throttledScroll);
    }, [throttledScroll]);
}

export default {
    usePerformanceMonitor,
    useRenderMonitor,
    useDebouncedSearch,
    useThrottledScroll,
};
