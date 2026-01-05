/**
 * Dynamic API Client Configuration
 *
 * Automatically configures axios with the correct base URL for different hosting environments
 */

import axios, { AxiosInstance } from 'axios';
import { getAppBaseUrl, detectBaseUrl } from './routeHelper';

/**
 * Create an axios instance with dynamic base URL
 */
export function createApiClient(): AxiosInstance {
    let baseURL: string;
    try {
        // Try to get base URL from Laravel config first (from .env)
        baseURL = getAppBaseUrl();
    } catch {
        // Fallback to detection if Laravel config is not available
        baseURL = detectBaseUrl();
    }

    const client = axios.create({
        baseURL,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        // CRITICAL: Send cookies with requests for session-based authentication
        // Without this, session cookies won't be sent and auth will fail after login
        withCredentials: true,
    });

    // Request interceptor to ensure URLs are properly formatted - no CSRF token needed
    client.interceptors.request.use((config) => {
        // Ensure the URL starts with a slash for proper concatenation
        if (config.url && !config.url.startsWith('/') && !config.url.startsWith('http')) {
            config.url = '/' + config.url;
        }

        // No CSRF token needed - authentication removed

        return config;
    });

        // Response interceptor for error handling - no authentication/CSRF checks
    client.interceptors.response.use(
        (response) => response,
        async (error) => {
            // Handle common errors
            if (error.response?.status === 404) {
                console.error('API Route not found:', error.config?.url);
                console.error('Base URL:', baseURL);
                console.error('Full URL:', error.config?.baseURL + error.config?.url);
            }

            return Promise.reject(error);
        }
    );

    return client;
}

/**
 * Default API client instance
 */
export const apiClient = createApiClient();

/**
 * Helper function to make API calls with automatic URL transformation
 */
export const api = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get: (url: string, config?: any) => apiClient.get(url, config),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    post: (url: string, data?: any, config?: any) => apiClient.post(url, data, config),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    put: (url: string, data?: any, config?: any) => apiClient.put(url, data, config),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete: (url: string, config?: any) => apiClient.delete(url, config),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    patch: (url: string, data?: any, config?: any) => apiClient.patch(url, data, config),
};