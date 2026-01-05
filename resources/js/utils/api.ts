/**
 * Utility functions for making API calls - no CSRF protection needed
 */

/**
 * Get default headers for API calls
 */
export const getApiHeaders = (): Record<string, string> => {
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    };
};

/**
 * Make a GET request with proper headers
 */
export const apiGet = async (url: string): Promise<Response> => {
    return fetch(url, {
        method: 'GET',
        headers: getApiHeaders(),
        credentials: 'same-origin',
    });
};

/**
 * Make a POST request with proper headers
 */
export const apiPost = async (url: string, data: unknown): Promise<Response> => {
    return fetch(url, {
        method: 'POST',
        headers: getApiHeaders(),
        credentials: 'same-origin',
        body: JSON.stringify(data),
    });
};

/**
 * Make a PUT request with proper headers
 */
export const apiPut = async (url: string, data: unknown): Promise<Response> => {
    return fetch(url, {
        method: 'PUT',
        headers: getApiHeaders(),
        credentials: 'same-origin',
        body: JSON.stringify(data),
    });
};

/**
 * Make a DELETE request with proper headers
 */
export const apiDelete = async (url: string): Promise<Response> => {
    return fetch(url, {
        method: 'DELETE',
        headers: getApiHeaders(),
        credentials: 'same-origin',
    });
};