import { MainHeader } from '@/components/main-header';
import { type BreadcrumbItem } from '@/types';
import { cn } from '@/lib/utils';

interface LayoutHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
    className?: string;
}

/**
 * Generic Layout Header Component
 * 
 * This component provides a reusable header for different layout types.
 * It can be customized with additional className props.
 */
export function LayoutHeader({ breadcrumbs = [], className }: LayoutHeaderProps) {
    return (
        <div className={cn("", className)}>
            <MainHeader breadcrumbs={breadcrumbs} />
        </div>
    );
}
