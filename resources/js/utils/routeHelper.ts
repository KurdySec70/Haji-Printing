/**
 * Dynamic Route Helper for Flexible Hosting
 *
 * This utility automatically generates correct route URLs based on the current hosting environment.
 * Works for subdirectory deployment (localhost/haji/public) and domain deployment (domain.com)
 */

// import { usePage } from '@inertiajs/react';

/**
 * Get the base URL for the application from Laravel via Inertia (from .env) with protocol correction
 * This version works in React component contexts
 */
export function getAppBaseUrlFromReact(pageProps?: { app?: { url?: string; asset_url?: string } }): string {
    // Always try to get from Laravel configuration first (from .env)
    try {
        if (pageProps) {
            let appUrl = pageProps.app?.url || pageProps.app?.asset_url;

        if (appUrl) {
            // Ensure we have a proper URL
            if (!appUrl.startsWith('http')) {
                appUrl = 'http://' + appUrl;
            }

            const urlObj = new URL(appUrl);

            // Always use HTTP for localhost to avoid connection issues
            if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
                urlObj.protocol = 'http:';
            }

            return urlObj.toString().replace(/\/+$/, ''); // Remove trailing slash
        }
        }
    } catch (error) {
        // Fallback to detection only if Laravel config is not available
        console.warn('Could not get app URL from Laravel props:', error);
    }

    const detectedUrl = detectBaseUrl();
    return detectedUrl;
}

/**
 * Get the base URL for the application (works in both React and non-React contexts)
 * This version tries to get URL from global window object first, then falls back to detection
 */
export function getAppBaseUrl(): string {
    // Try to get from global window object (set by Laravel/Inertia)
    try {
        // Check if we have app data in global window object
        const globalAppData = (window as { __INERTIA_APP_DATA__?: { app?: { url?: string; asset_url?: string } } }).__INERTIA_APP_DATA__;
        if (globalAppData?.app?.url || globalAppData?.app?.asset_url) {
            let appUrl = globalAppData.app.url || globalAppData.app.asset_url;

            // Ensure we have a proper URL
            if (appUrl && !appUrl.startsWith('http')) {
                appUrl = 'http://' + appUrl;
            }

            if (!appUrl) {
                return detectBaseUrl();
            }

            const urlObj = new URL(appUrl);

            // Always use HTTP for localhost to avoid connection issues
            if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
                urlObj.protocol = 'http:';
            }

            return urlObj.toString().replace(/\/+$/, '');
        }
    } catch (error) {
        // Fallback to detection
        console.warn('Could not get app URL from global data:', error);
    }

    const detectedUrl = detectBaseUrl();
    return detectedUrl;
}

/**
 * Detect base URL from current location (fallback method) with current protocol
 */
export function detectBaseUrl(): string {
    const currentPath = window.location.pathname;
    const currentOrigin = window.location.origin; // Already includes current protocol

    // Check if we're in a subdirectory deployment
    const subdirectoryMatch = currentPath.match(/^(\/[^/]+\/public)/);

    if (subdirectoryMatch) {
        // We're in a subdirectory deployment (e.g., localhost/haji/public)
        const detectedUrl = currentOrigin + subdirectoryMatch[1];
        return detectedUrl;
    } else {
        // We're in a domain deployment (e.g., example.com)
        return currentOrigin;
    }
}

/**
 * Transform any route to include the correct base URL (dynamic from .env)
 * @param route - The route path (e.g., '/admin/customers', 'admin/users')
 * @returns Complete URL for the route
 */
export function transformRoute(route: string): string {
    // Remove leading slash if present
    const cleanRoute = route.startsWith('/') ? route.slice(1) : route;

    // Get base URL from .env via Laravel configuration (dynamic)
    const baseUrl = getAppBaseUrl();

    // Combine base URL with route
    const finalUrl = `${baseUrl}/${cleanRoute}`;

    return finalUrl;
}

/**
 * Transform API routes specifically
 * @param apiRoute - API route path (e.g., '/api/search', 'api/users')
 * @returns Complete API URL
 */
export function transformApiRoute(apiRoute: string): string {
    return transformRoute(apiRoute);
}

/**
 * React hook for dynamic routing
 */
export function useRouteHelper() {
    const getBaseUrl = () => {
        try {
            return getAppBaseUrlFromReact();
        } catch {
            return detectBaseUrl();
        }
    };

    const transformUrl = (route: string) => {
        const cleanRoute = route.startsWith('/') ? route.slice(1) : route;
        const baseUrl = getBaseUrl();
        return `${baseUrl}/${cleanRoute}`;
    };

    const transformApiUrl = (apiRoute: string) => {
        return transformUrl(apiRoute);
    };

    const getViteDevServerUrl = (pageProps?: { app?: { vite_dev_server?: string } }) => {
        try {
            if (pageProps) {
                return pageProps.app?.vite_dev_server || 'http://localhost:5173';
            }
        } catch {
            return 'http://localhost:5173';
        }
        return 'http://localhost:5173';
    };

    return {
        baseUrl: getBaseUrl(),
        viteDevServerUrl: getViteDevServerUrl(),
        transformUrl,
        transformApiUrl,
        transformRoute: transformUrl,
    };
}

/**
 * Fix Inertia router for subdirectory deployment
 * This should be called in the main app component
 */
export function setupDynamicRouting() {
    // Override Inertia's URL handling for subdirectory deployment
    if (window.location.pathname.includes('/public/')) {
        const originalFetch = window.fetch;

        window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
            if (typeof input === 'string' && !input.startsWith('http')) {
                // Transform relative URLs to include base path
                input = transformRoute(input);
            } else if (input instanceof URL && !input.href.includes(window.location.origin)) {
                // Handle URL objects
                input = new URL(transformRoute(input.pathname + input.search), window.location.origin);
            }

            return originalFetch.call(this, input, init);
        };
    }
}

/**
 * Utility to check if current environment is subdirectory deployment
 */
export function isSubdirectoryDeployment(): boolean {
    return window.location.pathname.includes('/public/');
}

/**
 * Get the project name from subdirectory deployment
 */
export function getProjectName(): string | null {
    const match = window.location.pathname.match(/^\/([^/]+)\/public/);
    return match ? match[1] : null;
}