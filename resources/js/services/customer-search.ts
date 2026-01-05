import { transformRoute } from '@/utils/routeHelper';
import { Customer } from '@/types';

interface SearchResponse {
    success: boolean;
    customers: Customer[];
}

export async function searchCustomers(query: string, role?: string): Promise<Customer[]> {
    // Allow empty query to show all customers (limit to 20 for performance)
    const searchQuery = query.trim();

    const normalizedRole = role?.toLowerCase();
    let searchEndpoint: string | null = null;

    if (normalizedRole === 'cashier') {
        searchEndpoint = '/cashier/customers/search';
    } else if (normalizedRole === 'admin') {
        searchEndpoint = '/admin/customers/search';
    }

    if (!searchEndpoint) {
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
        if (currentPath.includes('/cashier')) {
            searchEndpoint = '/cashier/customers/search';
        } else {
            searchEndpoint = '/admin/customers/search';
        }
    }

    // Transform the endpoint to include correct base URL for hosting environment
    const fullEndpoint = transformRoute(searchEndpoint);
    const url = new URL(fullEndpoint, window.location.origin);
    url.searchParams.set('q', searchQuery);

    const requestUrl = url.origin === window.location.origin
        ? `${url.pathname}${url.search}`
        : url.toString();

    const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
        const fallbackBody = await response.text();
        throw new Error(`Unexpected response format: ${fallbackBody.substring(0, 120)}`);
    }

    const data: SearchResponse = await response.json();
    
    if (!data.success) {
        throw new Error('Search request failed');
    }

    return data.customers || [];
}
