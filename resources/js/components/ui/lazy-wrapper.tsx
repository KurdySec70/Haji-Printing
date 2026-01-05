import { Suspense, ComponentType, LazyExoticComponent } from 'react';

interface LazyWrapperProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

const defaultFallback = (
    <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-gray-100"></div>
    </div>
);

/**
 * Wrapper component for lazy-loaded components with consistent loading state
 */
export function LazyWrapper({ children, fallback = defaultFallback }: LazyWrapperProps) {
    return (
        <Suspense fallback={fallback}>
            {children}
        </Suspense>
    );
}

/**
 * Higher-order component to wrap lazy components with consistent loading states
 */
export function withLazyWrapper<T extends object>(
    LazyComponent: LazyExoticComponent<ComponentType<T>>,
    customFallback?: React.ReactNode
) {
    return function WrappedLazyComponent(props: T) {
        return (
            <LazyWrapper fallback={customFallback}>
                <LazyComponent {...props} />
            </LazyWrapper>
        );
    };
}

export default LazyWrapper;