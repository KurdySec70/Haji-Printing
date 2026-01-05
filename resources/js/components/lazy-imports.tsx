import { lazy } from 'react';
import { withLazyWrapper } from '@/components/ui/lazy-wrapper';

// Heavy Modal Components - Lazy Loaded
export const LazyCheckoutModal = withLazyWrapper(
    lazy(() => import('@/components/modals/checkout-modal'))
);

export const LazyOfferModal = withLazyWrapper(
    lazy(() => import('@/components/modals/offer-modal'))
);

export const LazyCustomerTransactionsModal = withLazyWrapper(
    lazy(() => import('@/components/modals/customer-transactions-modal'))
);

export const LazyTransactionDetailModal = withLazyWrapper(
    lazy(() => import('@/components/modals/transaction-detail-modal'))
);

export const LazyAddUserModal = withLazyWrapper(
    lazy(() => import('@/components/modals/add-user-modal'))
);

export const LazyAddProductModal = withLazyWrapper(
    lazy(() => import('@/components/modals/add-product-modal'))
);

export const LazyAddCustomerModal = withLazyWrapper(
    lazy(() => import('@/components/modals/add-customer-modal'))
);

export const LazyCalculatorModal = withLazyWrapper(
    lazy(() => import('@/components/modals/calculator-modal'))
);

export const LazyPostModal = withLazyWrapper(
    lazy(() => import('@/components/modals/post-modal'))
);

// Other heavy components
export const LazyViewProductModal = withLazyWrapper(
    lazy(() => import('@/components/modals/view-product-modal'))
);

export const LazyDeleteProductModal = withLazyWrapper(
    lazy(() => import('@/components/modals/delete-product-modal'))
);

export const LazyDeleteCustomerModal = withLazyWrapper(
    lazy(() => import('@/components/modals/delete-customer-modal'))
);

export const LazyDeleteUserModal = withLazyWrapper(
    lazy(() => import('@/components/modals/delete-user-modal'))
);

export const LazyDeletePostModal = withLazyWrapper(
    lazy(() => import('@/components/modals/delete-post-modal'))
);


// Additional components can be added here as needed

// Export all for easy importing
export const LazyComponents = {
    CheckoutModal: LazyCheckoutModal,
    OfferModal: LazyOfferModal,
    CustomerTransactionsModal: LazyCustomerTransactionsModal,
    TransactionDetailModal: LazyTransactionDetailModal,
    AddUserModal: LazyAddUserModal,
    AddProductModal: LazyAddProductModal,
    AddCustomerModal: LazyAddCustomerModal,
    CalculatorModal: LazyCalculatorModal,
    PostModal: LazyPostModal,
    ViewProductModal: LazyViewProductModal,
    DeleteProductModal: LazyDeleteProductModal,
    DeleteCustomerModal: LazyDeleteCustomerModal,
    DeleteUserModal: LazyDeleteUserModal,
    DeletePostModal: LazyDeletePostModal,
};