/**
 * CSV Export Utility Functions
 */

export interface ExportableProduct {
    id: number;
    name: string;
    price: number;
    type: string;
    width?: string | number;
    height?: string | number;
    created_at: string;
    updated_at: string;
}

export interface ExportableCustomer {
    id: number;
    name: string;
    email: string;
    phone?: string;
    username: string;
    role: string;
    created_at: string;
    updated_at: string;
}

/**
 * Convert array of products to CSV format
 */
export function convertProductsToCSV(products: ExportableProduct[]): string {
    if (products.length === 0) {
        return '';
    }

    // Define CSV headers
    const headers = [
        'ID',
        'Product Name',
        'Price (IQD)',
        'Type',
        'Width (cm)',
        'Height (cm)',
        'Created At',
        'Updated At'
    ];

    // Convert products to CSV rows
    const rows = products.map(product => [
        product.id.toString(),
        `"${product.name.replace(/"/g, '""')}"`, // Escape quotes in product name
        product.price.toString(),
        product.type.toUpperCase(),
        product.width ? product.width.toString() : '',
        product.height ? product.height.toString() : '',
        new Date(product.created_at).toLocaleDateString(),
        new Date(product.updated_at).toLocaleDateString()
    ]);

    // Combine headers and rows
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    return csvContent;
}

/**
 * Convert array of customers to CSV format
 */
export function convertCustomersToCSV(customers: ExportableCustomer[]): string {
    if (customers.length === 0) {
        return '';
    }

    // Define CSV headers
    const headers = [
        'ID',
        'Name',
        'Email',
        'Phone',
        'Username',
        'Role',
        'Created At',
        'Updated At'
    ];

    // Convert customers to CSV rows
    const rows = customers.map(customer => [
        customer.id.toString(),
        `"${customer.name.replace(/"/g, '""')}"`, // Escape quotes in customer name
        `"${(customer.email ?? '').replace(/"/g, '""')}"`, // Escape quotes in email (optional)
        customer.phone ? `"${customer.phone.replace(/"/g, '""')}"` : '',
        `"${customer.username.replace(/"/g, '""')}"`, // Escape quotes in username
        customer.role.toUpperCase(),
        new Date(customer.created_at).toLocaleDateString(),
        new Date(customer.updated_at).toLocaleDateString()
    ]);

    // Combine headers and rows
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    return csvContent;
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string = 'products.csv'): void {
    // Create blob with CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up URL object
    URL.revokeObjectURL(url);
}

/**
 * Export products to CSV with proper formatting
 */
export function exportProductsToCSV(products: ExportableProduct[], filename?: string): void {
    const csvContent = convertProductsToCSV(products);
    
    if (!csvContent) {
        throw new Error('No products to export');
    }
    
    const exportFilename = filename || `products_export_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, exportFilename);
}

/**
 * Export customers to CSV with proper formatting
 */
export function exportCustomersToCSV(customers: ExportableCustomer[], filename?: string): void {
    const csvContent = convertCustomersToCSV(customers);
    
    if (!csvContent) {
        throw new Error('No customers to export');
    }
    
    const exportFilename = filename || `customers_export_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, exportFilename);
}
