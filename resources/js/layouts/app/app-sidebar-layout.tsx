import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { LayoutHeader } from '@/components/layout';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AdminSidebar />
            <AppContent variant="sidebar" className="flex flex-col h-screen">
                {/* Fixed System Header */}
                <div className="flex-shrink-0">
                    <LayoutHeader breadcrumbs={breadcrumbs} />
                </div>
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </AppContent>
        </AppShell>
    );
}
