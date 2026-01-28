// API Response Types
export interface ApiResponse<T = unknown> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

// Error Types
export interface ValidationError {
    field: string;
    message: string;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
    status: number;
}

// Form Data Types
export interface FormData {
    [key: string]: string | number | boolean | File | null | undefined;
}

// Generic API Function Types
export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiRequestConfig {
    method: ApiMethod;
    headers?: Record<string, string>;
    body?: string | FormData;
    signal?: AbortSignal;
}

// Transaction Types
export interface Transaction {
    id: number;
    order_id: string;
    customer_id: number;
    cashier_id?: number;
    customer: Customer;
    cashier?: User;
    items: TransactionItem[];
    subtotal: number;
    discount_amount: number;
    grand_total: number;
    transaction_date: string;
    status: 'paid' | 'debt';
    type: 'transaction' | 'offer';
    offer_status?: 'pending' | 'accepted_paid' | 'accepted_debt' | 'rejected';
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface TransactionItem {
    id: number;
    name: string;
    quantity: number;
    unit_price: number;
    total: number;
    type: string;
    dimensions?: string;
    weight?: string;
    discount?: number;
}

export interface Customer {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    username?: string;
    role?: string;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    type: 'pcs' | 'kg' | 'width*height';
    width?: string | number;
    height?: string | number;
    dimensions?: string;
    weight?: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    username?: string;
    phone?: string;
    role?: string;
    avatar?: string;
    created_at: string;
    updated_at: string;
}

// Dashboard Types
export interface DashboardStats {
    total_transactions: number;
    total_revenue: number;
    total_customers: number;
    total_products: number;
    recent_transactions: Transaction[];
    monthly_revenue: MonthlyRevenue[];
}

export interface MonthlyRevenue {
    month: string;
    revenue: number;
}

// Filter and Sort Types
export interface FilterOptions {
    search?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
    customer_id?: number;
    type?: string;
    offer_status?: string;
    amount_min?: number;
    amount_max?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    per_page?: number;
}

export interface SortOptions {
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}

export interface PaginationOptions {
    page?: number;
    per_page?: number;
}

// Modal Types
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}

// Toast Types
export interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    description?: string;
    duration?: number;
}

// Performance Types
export interface PerformanceMetrics {
    loadTime: number;
    renderTime: number;
    memoryUsage: number;
    timestamp: number;
}

// Route Types
export interface RouteParams {
    [key: string]: string | number;
}

// Asset Types
export interface AssetConfig {
    baseUrl: string;
    version: string;
    cache: boolean;
}

// Transaction Data Types
export interface TransactionData {
    id?: number;
    order_id?: string;
    customer_id: number;
    cashier_id?: number;
    amount: number;
    status: 'paid' | 'debt';
    type?: 'transaction' | 'offer';
    offer_status?: 'pending' | 'accepted_paid' | 'accepted_debt' | 'rejected';
    notes?: string;
    items: TransactionItem[];
    subtotal: number;
    discount_amount: number;
    grand_total: number;
    transaction_date?: string;
    customer: Customer;
    cashier?: User;
}

// Order Item Types
export interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    unit_price: number;
    total: number;
    type: string;
    width?: number;
    height?: number;
    dimensions?: string;
    weight?: string;
}

// Filter State Types
export interface FilterState {
    search?: string;
    status?: string;
    customer_id?: number;
    date_from?: string;
    date_to?: string;
    type?: string;
    offer_status?: string;
    amount_min?: number;
    amount_max?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    per_page?: number;
}
