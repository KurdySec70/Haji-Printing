import { type PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

interface AdminMainContentProps extends PropsWithChildren {
    className?: string;
}

/**
 * Admin Main Content Component
 * 
 * This component provides the main content area for admin layouts.
 * It handles scrolling and provides a consistent content wrapper.
 */
export function AdminMainContent({ children, className }: AdminMainContentProps) {
    return (
        <div className={cn("flex-1 overflow-y-auto", className)}>
            {children}
        </div>
    );
}
