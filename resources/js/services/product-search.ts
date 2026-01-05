import { transformRoute } from '@/utils/routeHelper';

interface Product {
    id: number;
    name: string;
    price: number;
    type: string;
    width?: string | number;
    height?: string | number;
}

interface SearchResponse {
    success: boolean;
    products: Product[];
}

export async function searchProducts(query: string, role?: string): Promise<Product[]> {
    if (!query.trim()) {
        return [];
    }

    try {
        const normalizedRole = role?.toLowerCase();
        let searchEndpoint: string | null = null;

        if (normalizedRole === 'cashier') {
            searchEndpoint = '/cashier/products/search';
        } else if (normalizedRole === 'admin') {
            searchEndpoint = '/admin/products/search';
        }

        if (!searchEndpoint) {
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
            if (currentPath.includes('/cashier')) {
                searchEndpoint = '/cashier/products/search';
            } else {
                searchEndpoint = '/admin/products/search';
            }
        }

        // Transform the endpoint to include correct base URL for hosting environment
        const fullEndpoint = transformRoute(searchEndpoint);
        const url = new URL(fullEndpoint, window.location.origin);
        url.searchParams.set('q', query);

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

        return data.products;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }

        throw new Error('Product search failed');
    }
}
