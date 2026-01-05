import { Head } from '@inertiajs/react';

interface DashboardHeaderProps {
    title?: string;
    subtitle?: string;
}

export default function DashboardHeader({ 
    title = "Dashboard", 
    subtitle = "Overview of your printing business" 
}: DashboardHeaderProps) {
    return (
        <>
            <Head title={`${title} - Haji Printing`} />
            <div className="border-b border-sidebar-border/80 bg-background">
                <div className="mx-auto flex h-16 items-center px-6 md:max-w-7xl">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                        {subtitle && (
                            <p className="text-sm text-muted-foreground">{subtitle}</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
