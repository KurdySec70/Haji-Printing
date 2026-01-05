import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { Toaster } from '@/components/ui/toaster';
import { TransactionProvider } from '@/contexts/TransactionContext';
import { detectBaseUrl, isSubdirectoryDeployment, getAppBaseUrl } from '@/utils/routeHelper';
import './i18n'; // Initialize i18n

// Enable React Grab during local development to allow element capture for AI assistants
if (import.meta.env.DEV) {
    import('react-grab');
}

// Dynamic URL transformer for any subdirectory deployment
const transformUrl = (url: string): string => {
    if (!url || typeof url !== 'string' || url.startsWith('http')) {
        return url;
    }

    // Get the base URL from Laravel configuration
    const baseUrl = getAppBaseUrl();
    
    // If we're in a subdirectory deployment, ensure the URL includes the base path
    if (isSubdirectoryDeployment()) {
        const basePath = baseUrl.replace(window.location.origin, '');
        if (!url.startsWith(basePath)) {
            return basePath + (url.startsWith('/') ? url : '/' + url);
        }
    }
    
    return url;
};

// Configure Inertia.js for subdirectory deployment
import { router } from '@inertiajs/react';


// Configure the base URL for subdirectory deployment
if (isSubdirectoryDeployment()) {
    detectBaseUrl();

    // Override all router methods to use the URL transformer
    const originalVisit = router.visit;
    router.visit = (url: string, options: Record<string, unknown> = {}) => {
        return originalVisit.call(router, transformUrl(url), options);
    };

const originalGet = router.get;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(router as any).get = (url: string, data?: any, options?: any) => {
    return originalGet.call(router, transformUrl(url), data, options);
};

const originalPost = router.post;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(router as any).post = (url: string, data?: any, options?: any) => {
    return originalPost.call(router, transformUrl(url), data, options);
};

const originalPut = router.put;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(router as any).put = (url: string, data?: any, options?: any) => {
    return originalPut.call(router, transformUrl(url), data, options);
};

const originalPatch = router.patch;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(router as any).patch = (url: string, data?: any, options?: any) => {
    return originalPatch.call(router, transformUrl(url), data, options);
};

    const originalDelete = router.delete;
    router.delete = (url: string, options: Record<string, unknown> = {}) => {
        return originalDelete.call(router, transformUrl(url), options);
    };

    // Override prefetch method for subdirectory deployment
    const originalPrefetch = router.prefetch;
    router.prefetch = (url: string, options: Record<string, unknown> = {}) => {
        return originalPrefetch.call(router, transformUrl(url), options);
    };

    // Inertia.js configured for subdirectory deployment
}

// Suppress React DevTools warning in production
if (import.meta.env.PROD) {
    // @ts-expect-error - React DevTools global hook
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = { isDisabled: true };
}

const appName = import.meta.env.VITE_APP_NAME || 'Haji Printing';

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx', { eager: true }) as Record<string, () => Promise<unknown>>),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <TransactionProvider>
                <App {...props} />
                <Toaster />
            </TransactionProvider>
        );
    },
    progress: {
        color: '#4B5563',
        delay: 0,
        includeCSS: true,
        showSpinner: false,
    },
});

// This will set light / dark mode on load...
initializeTheme();
