import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useTranslation } from 'react-i18next';

import { PointOfSaleScreen } from '@/components/pos/point-of-sale-screen';

interface PointOfSaleProps {
    products?: unknown[];
}

export default function PointOfSale({ products: _products = [] }: PointOfSaleProps) {
    void _products;

    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('pos.title'),
            href: '/admin/point-of-sale',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <PointOfSaleScreen />
        </AppLayout>
    );
}