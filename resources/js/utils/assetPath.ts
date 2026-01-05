/**
 * Dynamic Asset Path Utility
 *
 * This utility automatically generates the correct asset paths based on the Laravel configuration from .env
 * Works for both subdirectory deployment (like localhost/haji/public) and domain deployment (like example.com)
 */

// import { usePage } from '@inertiajs/react';

/**
 * Get the asset base URL from Laravel configuration (from .env)
 */
export function getAssetBaseUrl(pageProps?: { app?: { asset_url?: string; url?: string } }): string {
    try {
        if (pageProps) {
            const assetUrl = pageProps.app?.asset_url || pageProps.app?.url;
            if (assetUrl) {
                return assetUrl;
            }
        }
    } catch {
        // Fallback to detection
    }

    // Fallback to detection
    const currentPath = window.location.pathname;
    const subdirectoryMatch = currentPath.match(/^(\/[^/]+\/public)/);

    if (subdirectoryMatch) {
        const fallbackUrl = window.location.origin + subdirectoryMatch[1];
        return fallbackUrl;
    } else {
        return window.location.origin;
    }
}

/**
 * Get the dynamic asset path for any file
 * @param path - The relative path to the asset (e.g., 'images/hajiLogo.jpg')
 * @returns The complete URL path to the asset
 */
export function getAssetPath(path: string): string {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // Get base URL from Laravel configuration (from .env)
    const baseUrl = getAssetBaseUrl();

    return `${baseUrl}/${cleanPath}`;
}

/**
 * Get the logo path specifically
 * @returns The correct path to the logo file
 */
export function getLogoPath(): string {
    return getAssetPath('images/hajiLogo.jpg');
}

/**
 * Get any image path from the images directory
 * @param imageName - The image filename (e.g., 'hajiLogo.jpg')
 * @returns The complete URL path to the image
 */
export function getImagePath(imageName: string): string {
    return getAssetPath(`images/${imageName}`);
}

/**
 * Alternative method using Laravel's asset helper approach
 * Now uses the same logic as getAssetPath for consistency
 */
export function getAssetUrl(path: string): string {
    return getAssetPath(path);
}