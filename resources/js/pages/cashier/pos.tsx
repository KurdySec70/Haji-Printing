import CashierLayout from '@/layouts/cashier-layout';
import { type BreadcrumbItem } from '@/types';
import { useTranslation } from 'react-i18next';

import { PointOfSaleScreen } from '@/components/pos/point-of-sale-screen';

interface PointOfSaleProps {
    products?: unknown[];
}

export default function CashierPOS({ products: _products = [] }: PointOfSaleProps) {
    void _products;

    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('pos.title'),
            href: '/cashier/pos',
        },
    ];

    return (
        <CashierLayout breadcrumbs={breadcrumbs}>
            <PointOfSaleScreen />
        </CashierLayout>
    );
}
