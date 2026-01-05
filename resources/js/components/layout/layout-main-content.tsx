import { type PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

interface LayoutMainContentProps extends PropsWithChildren {
    className?: string;
    variant?: 'default' | 'scrollable' | 'full-height';
}

/**
 * Generic Layout Main Content Component
 * 
 * This component provides a reusable main content area for different layout types.
 * It supports different variants for different use cases.
 */
export function LayoutMainContent({ 
    children, 
    className, 
    variant = 'scrollable' 
}: LayoutMainContentProps) {
    const variantClasses = {
        default: "flex-1",
        scrollable: "flex-1",
        'full-height': "h-full"
    };

    return (
        <div className={cn(variantClasses[variant], className)}>
            {children}
        </div>
    );
}
