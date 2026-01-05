import axios from 'axios';

// Set up axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Accept'] = 'application/json';

// CRITICAL: Send cookies with requests for session-based authentication
// Without this, session cookies won't be sent and auth will fail after login
axios.defaults.withCredentials = true;

// Set base URL for subdirectory deployment
// Extract the base path from the current URL
const currentPath = window.location.pathname;
let basePath = '';

// Check if we're in a subdirectory deployment
if (currentPath.includes('/haji/public')) {
    basePath = '/haji/public';
} else if (currentPath.includes('/haji')) {
    basePath = '/haji';
}

// Set the base URL
axios.defaults.baseURL = window.location.origin + basePath;

// Request interceptor - no CSRF token needed
axios.interceptors.request.use(
    (config) => {
        // No CSRF token needed - authentication removed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - no CSRF error handling needed
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // No CSRF error handling needed
        return Promise.reject(error);
    }
);

export default axios;