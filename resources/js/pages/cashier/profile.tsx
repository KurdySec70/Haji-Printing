import CashierLayout from '@/layouts/cashier-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function CashierProfile() {
    const { t } = useTranslation();
    
    return (
        <CashierLayout>
            <Head title={t('user.profile')} />
            {/* Empty page content */}
        </CashierLayout>
    );
}
