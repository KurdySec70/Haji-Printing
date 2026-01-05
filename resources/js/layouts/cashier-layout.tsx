import { AppShell } from '@/components/app-shell';
import { CashierHeader } from '@/components/cashier/cashier-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function CashierLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="header">
            <div className="flex flex-col h-screen w-full">
                <CashierHeader breadcrumbs={breadcrumbs} />
                <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
                    {children}
                </main>
            </div>
        </AppShell>
    );
}