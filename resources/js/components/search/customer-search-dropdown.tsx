import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, ChevronDown, Loader2, Phone, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDebouncedSearch } from '@/hooks/use-debounced-search';
import { searchCustomers } from '@/services/customer-search';
import { Input } from '@/components/ui/input';
import { Customer } from '@/types';


interface CustomerSearchDropdownProps {
    onCustomerSelect: (customer: Customer) => void;
    placeholder?: string;
    className?: string;
    value?: string;
    onClear?: () => void;
    role?: string;
}

export default function CustomerSearchDropdown({
    onCustomerSelect,
    placeholder,
    className = '',
    value = '',
    onClear,
    role
}: CustomerSearchDropdownProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const executeSearch = useCallback((value: string) => searchCustomers(value, role), [role]);

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
        const inputValue = e.target.value;
        setQuery(inputValue);
        setIsOpen(inputValue.length > 0);
    };

    const handleCustomerClick = (customer: Customer) => {
        onCustomerSelect(customer);
        setQuery('');
        setIsOpen(false);
        clearResults();
    };

    const handleInputFocus = () => {
        if (query.length > 0 || value.length > 0) {
            setIsOpen(true);
        } else {
            // Show all customers when focused and empty
            setQuery('');
            setIsOpen(true);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    const handleClearInput = () => {
        setQuery('');
        setIsOpen(false);
        clearResults();
        // Clear the input value by setting it to empty string
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        // Notify parent component that input was cleared
        onClear?.();
        inputRef.current?.focus();
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder || t('pos.searchCustomersPlaceholder')}
                    value={value || query || ''}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onKeyDown={handleKeyDown}
                    className="pl-10 pr-10 h-10 sm:h-12 text-sm sm:text-lg border-gray-300 dark:border-gray-800 focus:border-[#3b82f6] focus:ring-[#3b82f6] bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100"
                />
                {loading && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 animate-spin" />
                )}
                {!loading && (query || value) && (
                    <button
                        onClick={handleClearInput}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 w-4 h-4 cursor-pointer"
                        title={t('common.buttons.clear')}
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
                {!loading && !query && !value && (
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
                        results.map((customer) => (
                            <div
                                key={customer.id}
                                onClick={() => handleCustomerClick(customer)}
                                className="px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-b-0 transition-colors"
                            >
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{customer.name}</div>
                                    {customer.phone && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                            <Phone className="w-3 h-3" />
                                            {customer.phone}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : query.length > 0 ? (
                        <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                            <div className="text-sm">{t('pos.noCustomersFound', { query })}</div>
                            <div className="text-xs mt-1">{t('pos.customerSearchHint')}</div>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
