import { MainHeader } from '@/components/main-header';
import { type BreadcrumbItem } from '@/types';

interface AdminHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

/**
 * Admin Header Component
 * 
 * This component wraps the MainHeader specifically for admin layouts.
 * It provides a consistent header interface for admin pages.
 */
export function AdminHeader({ breadcrumbs = [] }: AdminHeaderProps) {
    return <MainHeader breadcrumbs={breadcrumbs} />;
}
