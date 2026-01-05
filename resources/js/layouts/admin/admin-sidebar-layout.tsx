import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader, AdminMainContent } from '@/components/layout';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AdminSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AdminSidebar />
            <AppContent variant="sidebar" className="flex flex-col h-screen overflow-hidden">
                <AdminHeader breadcrumbs={breadcrumbs} />
                <AdminMainContent>
                    {children}
                </AdminMainContent>
            </AppContent>
        </AppShell>
    );
}
