import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Transaction, Product } from '@/types';
import { useTranslation } from 'react-i18next';

import { PointOfSaleScreen } from '@/components/pos/point-of-sale-screen';

interface PointOfSaleProps {
    products?: Product[];
    transactionToEdit?: Transaction | null;
}

export default function PointOfSale({ products = [], transactionToEdit = null }: PointOfSaleProps) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('pos.title'),
            href: '/admin/point-of-sale',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <PointOfSaleScreen products={products} transactionToEdit={transactionToEdit} />
        </AppLayout>
    );
}