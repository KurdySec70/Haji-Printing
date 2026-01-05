import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

// Re-export API types
export * from './api';

export interface Auth {
    user: User | null;
    isAuthenticated: boolean;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface Post {
    id: number;
    title: string;
    description: string;
    content: string;
    image_url?: string;
    image_path?: string;
    created_at: string;
    updated_at: string;
}

// Component Props Types
export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
}

export interface InputProps extends BaseComponentProps {
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    error?: string;
    disabled?: boolean;
    required?: boolean;
}

export interface SelectProps extends BaseComponentProps {
    options: Array<{ value: string; label: string }>;
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
}

// Form Types
export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'select' | 'textarea';
    placeholder?: string;
    required?: boolean;
    options?: Array<{ value: string; label: string }>;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        message?: string;
    };
}

export interface FormState {
    values: Record<string, string | number | boolean>;
    errors: Record<string, string>;
    touched: Record<string, boolean>;
    isSubmitting: boolean;
    isValid: boolean;
}

// Table Types
export interface TableColumn<T = unknown> {
    key: string;
    title: string;
    sortable?: boolean;
    render?: (value: unknown, row: T) => React.ReactNode;
    width?: string;
    align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = unknown> {
    data: T[];
    columns: TableColumn<T>[];
    loading?: boolean;
    pagination?: {
        current: number;
        total: number;
        perPage: number;
        onPageChange: (page: number) => void;
    };
    sorting?: {
        sortBy: string;
        sortOrder: 'asc' | 'desc';
        onSort: (key: string) => void;
    };
    onRowClick?: (row: T) => void;
}

// Chart Types
export interface ChartData {
    labels: string[];
    datasets: Array<{
        label: string;
        data: number[];
        backgroundColor?: string | string[];
        borderColor?: string | string[];
        borderWidth?: number;
    }>;
}

export interface ChartOptions {
    responsive?: boolean;
    maintainAspectRatio?: boolean;
    plugins?: {
        legend?: {
            display?: boolean;
            position?: 'top' | 'bottom' | 'left' | 'right';
        };
        tooltip?: {
            enabled?: boolean;
        };
    };
    scales?: {
        x?: {
            display?: boolean;
            title?: {
                display?: boolean;
                text?: string;
            };
        };
        y?: {
            display?: boolean;
            title?: {
                display?: boolean;
                text?: string;
            };
        };
    };
}
