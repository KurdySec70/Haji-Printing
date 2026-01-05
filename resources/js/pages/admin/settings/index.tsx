import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/page-header';
import { SettingsTabs } from '@/components/settings/settings-tabs';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function SettingsIndex() {
    const { t } = useTranslation();

    const breadcrumbs = [
        { title: t('sidebar.settings'), href: '/admin/settings' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('sidebar.settings')} - ${t('app.name')}`} />
            
            <div className="flex flex-1 flex-col gap-6 p-6 min-h-screen bg-white dark:bg-[#0a0a0a]">
                {/* Page Header Component */}
                <PageHeader
                    title={t('sidebar.settings')}
                    variant="elevated"
                    size="lg"
                />

                {/* Settings Content */}
                <div className="flex-1">
                    <SettingsTabs />
                </div>
            </div>
        </AppLayout>
    );
}
