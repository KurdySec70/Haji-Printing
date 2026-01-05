import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Package, ChevronDown, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDebouncedSearch } from '@/hooks/use-debounced-search';
import { searchProducts } from '@/services/product-search';
import { Input } from '@/components/ui/input';

interface Product {
    id: number;
    name: string;
    price: number;
    type: string;
    width?: string | number;
    height?: string | number;
}

interface ProductSearchDropdownProps {
    onProductSelect: (product: Product) => void;
    placeholder?: string;
    className?: string;
    role?: string;
}

export default function ProductSearchDropdown({
    onProductSelect,
    placeholder,
    className = '',
    role
}: ProductSearchDropdownProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const executeSearch = useCallback((value: string) => searchProducts(value, role), [role]);

    const {
        query,
        setQuery,
        results,
        loading,
        error,
        clearResults
    } = useDebouncedSearch(executeSearch, {
        delay: 300,
        minLength: 1
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        setIsOpen(value.length > 0);
    };

    const handleProductClick = (product: Product) => {
        onProductSelect(product);
        setQuery('');
        setIsOpen(false);
        clearResults();
    };

    const handleInputFocus = () => {
        if (query.length > 0) {
            setIsOpen(true);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder || t('pos.searchProductsPlaceholder')}
                    value={query}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onKeyDown={handleKeyDown}
                    className="pl-10 pr-10 h-10 sm:h-12 text-sm sm:text-lg border-gray-300 dark:border-gray-800 focus:border-[#10b981] focus:ring-[#10b981] bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100"
                />
                {loading && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 animate-spin" />
                )}
                {!loading && query && (
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                )}
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {loading ? (
                        <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                            <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
                            {t('common.messages.loading')}
                        </div>
                    ) : error ? (
                        <div className="px-4 py-3 text-center text-red-500 dark:text-red-400">
                            {error}
                        </div>
                    ) : results && results.length > 0 ? (
                        results.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => handleProductClick(product)}
                                className="px-4 py-3 hover:bg-green-50 dark:hover:bg-green-900/30 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-b-0 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900 dark:text-gray-100">{product.name}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                            <Package className="w-3 h-3" />
                                            {product.type}
                                        </div>
                                    </div>
                                    <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                                        {product.price.toLocaleString()} IQD
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : query.length > 0 ? (
                        <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                            {t('products.noResults')}
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
