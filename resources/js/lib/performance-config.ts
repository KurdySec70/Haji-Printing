/**
 * Performance Configuration for Haji Printing
 * 
 * This file contains performance optimization settings and utilities
 * to improve navigation speed and overall application performance.
 */

// Inertia.js performance settings
export const INERTIA_CONFIG = {
    // Progress bar settings
    progress: {
        color: '#4B5563',
        delay: 0,
        includeCSS: true,
        showSpinner: false,
    },
    
    // Preloading settings
    preload: {
        enabled: true,
        delay: 100, // ms
    },
    
    // Cache settings
    cache: {
        enabled: true,
        ttl: 300000, // 5 minutes in milliseconds
    }
};

// Component lazy loading configuration
export const LAZY_LOADING_CONFIG = {
    // Components that should be lazy loaded
    lazyComponents: [
        'checkout-modal',
        'customer-transactions-modal',
        'transaction-detail-modal',
        'add-user-modal',
        'add-product-modal',
        'add-customer-modal',
        'calculator-modal',
        'post-modal',
        'view-product-modal',
        'delete-product-modal',
        'delete-customer-modal',
        'delete-user-modal',
        'delete-post-modal',
    ],
    
    // Components that should be eagerly loaded (critical for navigation)
    eagerComponents: [
        'page-header',
        'sidebar',
        'navigation',
        'breadcrumbs',
        'stats-card',
    ],
    
    // Loading fallback configuration
    fallback: {
        spinner: true,
        skeleton: true,
        delay: 200, // ms
    }
};

// Database query optimization settings
export const DATABASE_CONFIG = {
    // Cache duration for different types of data
    cache: {
        dashboard: 300, // 5 minutes
        products: 600,  // 10 minutes
        customers: 600, // 10 minutes
        transactions: 60, // 1 minute
        settings: 1800, // 30 minutes
    },
    
    // Pagination settings
    pagination: {
        default: 25,
        max: 100,
        large: 50,
    },
    
    // Query optimization
    optimization: {
        useIndexes: true,
        limitRelations: true,
        selectSpecific: true,
    }
};

// Bundle optimization settings
export const BUNDLE_CONFIG = {
    // Chunk sizes
    chunks: {
        vendor: ['react', 'react-dom', '@inertiajs/react'],
        ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-toast',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-label',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-tooltip',
        ],
        utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
        i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
        icons: ['lucide-react'],
    },
    
    // Asset optimization
    assets: {
        inlineLimit: 4096, // 4KB
        compress: true,
        minify: true,
    }
};

// Performance monitoring
export const PERFORMANCE_MONITORING = {
    enabled: process.env.NODE_ENV === 'development',
    
    // Metrics to track
    metrics: {
        navigation: true,
        componentRender: true,
        apiCalls: true,
        databaseQueries: true,
    },
    
    // Thresholds for warnings
    thresholds: {
        navigation: 1000, // ms
        componentRender: 100, // ms
        apiCall: 2000, // ms
        databaseQuery: 500, // ms
    }
};

// Utility functions for performance optimization
export const PerformanceUtils = {
    /**
     * Debounce function for search inputs
     */
    debounce: <T extends (...args: unknown[]) => unknown>(
        func: T,
        wait: number
    ): ((...args: Parameters<T>) => void) => {
        let timeout: NodeJS.Timeout;
        return (...args: Parameters<T>) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    },
    
    /**
     * Throttle function for scroll events
     */
    throttle: <T extends (...args: unknown[]) => unknown>(
        func: T,
        limit: number
    ): ((...args: Parameters<T>) => void) => {
        let inThrottle: boolean;
        return (...args: Parameters<T>) => {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    /**
     * Check if component should be lazy loaded
     */
    shouldLazyLoad: (componentName: string): boolean => {
        return LAZY_LOADING_CONFIG.lazyComponents.includes(componentName);
    },
    
    /**
     * Get cache key for data
     */
    getCacheKey: (type: string, params: Record<string, unknown> = {}): string => {
        const paramString = Object.keys(params)
            .sort()
            .map(key => `${key}:${params[key]}`)
            .join('|');
        return `${type}_${paramString}`;
    },
    
    /**
     * Measure performance of a function
     */
    measure: async <T>(
        name: string,
        fn: () => Promise<T> | T
    ): Promise<T> => {
        if (!PERFORMANCE_MONITORING.enabled) {
            return await fn();
        }
        
        const start = performance.now();
        const result = await fn();
        const end = performance.now();
        const duration = end - start;
        
        console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
        
        return result;
    }
};

export default {
    INERTIA_CONFIG,
    LAZY_LOADING_CONFIG,
    DATABASE_CONFIG,
    BUNDLE_CONFIG,
    PERFORMANCE_MONITORING,
    PerformanceUtils,
};
