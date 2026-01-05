import { AppShell } from '@/components/app-shell';
import { CustomerHeader } from '@/components/customer/customer-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function CustomerLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="header">
            <div className="flex flex-col h-screen w-full">
                <CustomerHeader breadcrumbs={breadcrumbs} />
                <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
                    {children}
                </main>
            </div>
        </AppShell>
    );
}