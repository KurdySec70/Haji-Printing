import { useCallback, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { transformRoute } from '@/utils/routeHelper';

interface PrefetchOptions {
    delay?: number;
    priority?: 'high' | 'normal' | 'low';
    cache?: boolean;
}

interface PrefetchCache {
    [url: string]: {
        data: unknown;
        timestamp: number;
        ttl: number;
    };
}

/**
 * Simplified prefetching hook for instant navigation
 * Uses Inertia's built-in prefetching with intelligent caching
 */
export function usePrefetch() {
    const prefetchCache = useRef<PrefetchCache>({});
    const hoverTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

    // Default TTL for cached prefetches (5 minutes)
    const DEFAULT_TTL = 5 * 60 * 1000;

    /**
     * Check if prefetch data is still valid
     */
    const isCacheValid = useCallback((url: string, ttl: number = DEFAULT_TTL): boolean => {
        const cached = prefetchCache.current[url];
        if (!cached) return false;
        
        const now = Date.now();
        return (now - cached.timestamp) < ttl;
    }, [DEFAULT_TTL]);

    /**
     * Get cached prefetch data
     */
    const getCachedData = useCallback((url: string) => {
        const cached = prefetchCache.current[url];
        return cached ? cached.data : null;
    }, []);

    /**
     * Store prefetch data in cache
     */
    const setCachedData = useCallback((url: string, data: unknown, ttl: number = DEFAULT_TTL) => {
        prefetchCache.current[url] = {
            data,
            timestamp: Date.now(),
            ttl
        };
    }, [DEFAULT_TTL]);

    /**
     * Clean up expired cache entries
     */
    const cleanupCache = useCallback(() => {
        const now = Date.now();
        Object.keys(prefetchCache.current).forEach(url => {
            const cached = prefetchCache.current[url];
            if ((now - cached.timestamp) >= cached.ttl) {
                delete prefetchCache.current[url];
            }
        });
    }, []);

    /**
     * Prefetch a route using Inertia's built-in prefetching
     */
    const prefetchRoute = useCallback(async (
        url: string, 
        options: PrefetchOptions = {}
    ): Promise<unknown> => {
        const { delay = 0, cache = true } = options;
        
        // Transform URL for subdirectory deployment
        const transformedUrl = transformRoute(url);
        
        // Check cache first
        if (cache && isCacheValid(transformedUrl)) {
            return getCachedData(transformedUrl);
        }

        try {
            // Add delay for low priority prefetches
            if (delay > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }

            // Use Inertia's prefetch method
            router.prefetch(transformedUrl);

            // Mark as prefetched in cache
            if (cache) {
                setCachedData(transformedUrl, { prefetched: true });
            }

            return { prefetched: true };

        } catch {
            console.warn(`Prefetch failed for ${transformedUrl}`);
            return null;
        }
    }, [isCacheValid, getCachedData, setCachedData]);

    /**
     * Prefetch on hover with debouncing
     */
    const prefetchOnHover = useCallback((
        url: string,
        options: PrefetchOptions & { hoverDelay?: number } = {}
    ) => {
        const { hoverDelay = 200, ...prefetchOptions } = options;
        
        return {
            onMouseEnter: () => {
                // Clear existing timeout
                const existingTimeout = hoverTimeouts.current.get(url);
                if (existingTimeout) {
                    clearTimeout(existingTimeout);
                }

                // Set new timeout
                const timeout = setTimeout(() => {
                    prefetchRoute(url, { ...prefetchOptions, priority: 'high' });
                    hoverTimeouts.current.delete(url);
                }, hoverDelay);

                hoverTimeouts.current.set(url, timeout);
            },
            onMouseLeave: () => {
                // Cancel hover prefetch if mouse leaves quickly
                const timeout = hoverTimeouts.current.get(url);
                if (timeout) {
                    clearTimeout(timeout);
                    hoverTimeouts.current.delete(url);
                }
            },
            onFocus: () => {
                // Immediate prefetch on focus (keyboard navigation)
                prefetchRoute(url, { ...prefetchOptions, priority: 'high', delay: 0 });
            }
        };
    }, [prefetchRoute]);

    /**
     * Prefetch on intersection (when element comes into view)
     */
    const prefetchOnIntersection = useCallback((
        url: string,
        options: PrefetchOptions = {}
    ) => {
        return {
            ref: (element: HTMLElement | null) => {
                if (!element) return;

                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                prefetchRoute(url, { ...options, priority: 'low', delay: 100 });
                                observer.unobserve(entry.target);
                            }
                        });
                    },
                    { rootMargin: '50px' }
                );

                observer.observe(element);
            }
        };
    }, [prefetchRoute]);

    /**
     * Cancel active prefetches
     */
    const cancelPrefetches = useCallback(() => {
        // Clear hover timeouts
        hoverTimeouts.current.forEach((timeout) => {
            clearTimeout(timeout);
        });
        hoverTimeouts.current.clear();
    }, []);

    /**
     * Prefetch multiple routes in parallel
     */
    const prefetchMultiple = useCallback(async (
        urls: string[],
        options: PrefetchOptions = {}
    ) => {
        const promises = urls.map(url => prefetchRoute(url, options));
        return Promise.allSettled(promises);
    }, [prefetchRoute]);

    /**
     * Get prefetch statistics
     */
    const getPrefetchStats = useCallback(() => {
        return {
            cacheSize: Object.keys(prefetchCache.current).length,
            queueSize: 0, // Simplified - no queue in this version
            activePrefetches: 0, // Simplified - no active tracking in this version
            cacheKeys: Object.keys(prefetchCache.current)
        };
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cancelPrefetches();
            cleanupCache();
        };
    }, [cancelPrefetches, cleanupCache]);

    // Periodic cache cleanup
    useEffect(() => {
        const interval = setInterval(cleanupCache, 60000); // Every minute
        return () => clearInterval(interval);
    }, [cleanupCache]);

    return {
        prefetchRoute,
        prefetchOnHover,
        prefetchOnIntersection,
        prefetchMultiple,
        cancelPrefetches,
        getCachedData,
        isCacheValid,
        getPrefetchStats,
        clearCache: cleanupCache
    };
}

export default usePrefetch;