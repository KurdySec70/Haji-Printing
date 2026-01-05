// import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { usePage } from '@inertiajs/react';

/**
 * React Hook for Dynamic Asset Paths
 *
 * This hook provides dynamic asset paths that automatically adapt to different hosting environments.
 * It uses the asset URL provided by Laravel via Inertia props.
 */

interface AppData {
    name: string;
    url: string;
    asset_url?: string;
    storage_url?: string;
}

export function useAssetPath() {
    const { props } = usePage<{ app: AppData }>();

    const assetUrl = useMemo(() => {
        // Prefer Inertia-provided asset_url/url; fallback to current origin
        let baseUrl = props.app?.asset_url || props.app?.url || (typeof window !== 'undefined' ? window.location.origin : '');

        try {
            // Ensure we have a full URL (add protocol if missing)
            if (baseUrl && !baseUrl.startsWith('http')) {
                baseUrl = 'http://' + baseUrl;
            }

            const urlObj = new URL(baseUrl);

            // Align protocol/port with current page to avoid HTTPS/HTTP mismatch in dev
            if (typeof window !== 'undefined' && urlObj.hostname === window.location.hostname) {
                urlObj.protocol = window.location.protocol;
                if (!urlObj.port) {
                    urlObj.port = window.location.port;
                }
            }

            return urlObj.toString().replace(/\/+$/, '');
        } catch {
            // Fallback: return as-is (minus trailing slash)
            return baseUrl.replace(/\/+$/, '');
        }
    }, [props.app]);

    const storageUrl = useMemo(() => {
        let baseUrl = props.app?.storage_url || props.app?.url || (typeof window !== 'undefined' ? window.location.origin : '');

        try {
            if (baseUrl && !baseUrl.startsWith('http')) {
                baseUrl = 'http://' + baseUrl;
            }

            const urlObj = new URL(baseUrl);

            if (typeof window !== 'undefined' && urlObj.hostname === window.location.hostname) {
                urlObj.protocol = window.location.protocol;
                if (!urlObj.port) {
                    urlObj.port = window.location.port;
                }
            }

            return urlObj.toString().replace(/\/+$/, '');
        } catch {
            return baseUrl.replace(/\/+$/, '');
        }
    }, [props.app]);

    /**
     * Get the full asset URL for any path
     * @param path - Relative path to the asset (e.g., 'images/logo.jpg')
     * @returns Full URL to the asset
     */
    const getAssetUrl = (path: string) => {
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `${assetUrl}/${cleanPath}`;
    };

    /**
     * Get the logo URL
     * @returns Full URL to the logo
     */
    const getLogoUrl = () => {
        const logoUrl = getAssetUrl('images/hajiLogo.jpg');
        return logoUrl;
    };

    /**
     * Get any image URL from the images directory
     * @param imageName - Image filename
     * @returns Full URL to the image
     */
    const getImageUrlFromImages = (imageName: string) => getAssetUrl(`images/${imageName}`);

    /**
     * Get URL for any file in the public directory
     * @param filePath - File path relative to public directory
     * @returns Full URL to the file
     */
    const getPublicUrl = (filePath: string) => getAssetUrl(filePath);

    /**
     * Get URL for files in the storage directory (user uploads)
     * @param storagePath - Path relative to storage/app/public (e.g., 'posts/image.jpg')
     * @returns Full URL to the storage file
     */
    const getStorageUrl = (storagePath: string) => {
        if (!storagePath) return null;
        
        const cleanPath = storagePath.startsWith('/') ? storagePath.slice(1) : storagePath;
        
        // Use dedicated storage URL if available, otherwise fallback to asset URL
        if (storageUrl) {
            return `${storageUrl}/${cleanPath}`;
        }
        
        return getAssetUrl(`storage/${cleanPath}`);
    };

    /**
     * Get post image URL - handles both image_url and image_path
     * @param post - Post object with image_url or image_path
     * @returns Full URL to the post image or null if no image
     */
    const getPostImageUrl = (post: { image_url?: string; image_path?: string }) => {
        if (!post) return null;
        
        // Priority 1: Use image_url if available
        if (post.image_url) {
            // If image_url is already a full URL, return as is
            if (post.image_url.startsWith('http')) {
                return post.image_url;
            }
            // If it's a relative URL, make it absolute
            return getAssetUrl(post.image_url.startsWith('/') ? post.image_url.slice(1) : post.image_url);
        }

        // Priority 2: Use image_path if available
        if (post.image_path) {
            return getStorageUrl(post.image_path);
        }

        return null;
    };

    /**
     * Get any image URL with fallback handling
     * @param imagePath - Path to the image (can be relative or absolute)
     * @returns Full URL to the image or null if no path provided
     */
    const getImageUrl = (imagePath: string | null | undefined) => {
        if (!imagePath) return null;
        
        // If it's already a full URL, return as is
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        // If it starts with storage/, treat it as a storage path
        if (imagePath.startsWith('storage/')) {
            return getStorageUrl(imagePath.replace('storage/', ''));
        }
        
        // Otherwise, treat it as a regular asset
        return getAssetUrl(imagePath.startsWith('/') ? imagePath.slice(1) : imagePath);
    };

    return {
        assetUrl,
        storageUrl,
        getAssetUrl,
        getLogoUrl,
        getImageUrlFromImages,
        getImageUrl,
        getPublicUrl,
        getStorageUrl,
        getPostImageUrl,
    };
}

/**
 * Fallback function for use outside React components
 * This function dynamically detects the environment and generates appropriate URLs
 */
export function getAssetPath(path: string): string {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // Get the current path to determine if we're in a subdirectory
    const currentPath = window.location.pathname;

    // Check if we're running in a subdirectory (contains /project_name/public)
    const subdirectoryMatch = currentPath.match(/^(\/[^/]+\/public)/);

    if (subdirectoryMatch) {
        // We're in a subdirectory deployment (e.g., localhost/haji/public)
        const basePath = subdirectoryMatch[1];
        return `${basePath}/${cleanPath}`;
    } else {
        // We're in a domain deployment (e.g., example.com)
        return `/${cleanPath}`;
    }
}

/**
 * Get logo path (fallback function)
 */
export function getLogoPath(): string {
    return getAssetPath('images/hajiLogo.jpg');
}