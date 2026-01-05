// Error page exports for easy importing
export { default as Error400 } from './400';
export { default as Error401 } from './401';
export { default as Error403 } from './403';
export { default as Error404 } from './404';
export { default as Error410 } from './410';
export { default as Error422 } from './422';
export { default as Error429 } from './429';
export { default as Error500 } from './500';
export { default as Error503 } from './503';
export { default as GenericError } from './generic';

// Error page types
export interface ErrorPageProps {
    message?: string;
    errors?: Record<string, string[]>;
    expired_at?: string;
    retryAfter?: number;
    title?: string;
    statusCode?: number;
    showRetry?: boolean;
    showReport?: boolean;
}
