import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface CustomerFiltersProps {
    onFiltersChange?: (filters: FilterState) => void;
    className?: string;
}

interface FilterState {
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export default function CustomerFilters({ onFiltersChange, className = '' }: CustomerFiltersProps) {
    const { t } = useTranslation();
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        sortBy: 'name',
        sortOrder: 'asc'
    });

    // Dropdown states
    const [isSortByDropdownOpen, setIsSortByDropdownOpen] = useState(false);
    
    // Refs for dropdowns
    const sortByDropdownRef = useRef<HTMLDivElement>(null);

    const sortOptions = [
        { value: 'name', label: t('customers.filters.sortByName') },
        { value: 'email', label: t('customers.filters.sortByEmail') }
    ];

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFiltersChange?.(newFilters);
    };

    const clearFilters = () => {
        const clearedFilters = {
            search: '',
            sortBy: 'name',
            sortOrder: 'asc' as const
        };
        setFilters(clearedFilters);
        onFiltersChange?.(clearedFilters);
    };

    const hasActiveFilters = filters.search;

    // Click outside handler for dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortByDropdownRef.current && !sortByDropdownRef.current.contains(event.target as Node)) {
                setIsSortByDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Dropdown selection handlers
    const handleSortBySelect = (value: string) => {
        handleFilterChange('sortBy', value);
        setIsSortByDropdownOpen(false);
    };


    return (
        <div className={cn("w-full relative z-25", className)}>
            {/* Main Container */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-visible">
                {/* Header */}
                <div className="bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 rounded-t-lg">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#F58E18] rounded-lg flex items-center justify-center shadow-sm">
                                    <Filter className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {t('customers.filters.activeFilters')}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('customers.filters.filterAndSortYourCustomers')}
                                    </p>
                                </div>
                            </div>
                            
                            {hasActiveFilters && (
                                <Button
                                    onClick={clearFilters}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    {t('customers.filters.clearFilters')}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Basic Filters - Always Visible */}
                <div className="p-4 rounded-b-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div className="space-y-2">
                            <Label htmlFor="search" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Search className="w-4 h-4 text-blue-500" />
                                {t('customers.filters.search')}
                            </Label>
                            <Input
                                id="search"
                                type="text"
                                placeholder={t('customers.filters.searchPlaceholder')}
                                value={filters.search}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('search', e.target.value)}
                                className="w-full"
                            />
                        </div>

                        {/* Sort By */}
                        <div className="space-y-2">
                            <Label htmlFor="sortBy" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Filter className="w-4 h-4 text-purple-500" />
                                {t('customers.filters.sortBy')}
                            </Label>
                            <div className="relative" ref={sortByDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsSortByDropdownOpen(!isSortByDropdownOpen)}
                                    className="w-full h-10 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all duration-200 px-3 py-2 text-left flex items-center justify-between cursor-pointer"
                                >
                                    <span className={filters.sortBy ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                                        {sortOptions.find(opt => opt.value === filters.sortBy)?.label || t('customers.filters.sortByName')}
                                    </span>
                                    <ChevronDown 
                                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                            isSortByDropdownOpen ? 'rotate-180' : ''
                                        }`} 
                                    />
                                </button>
                                
                                {isSortByDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-[110] overflow-hidden">
                                        {sortOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => handleSortBySelect(option.value)}
                                                className="w-full px-3 py-2 text-left hover:bg-purple-50 dark:hover:bg-purple-900/30 focus:bg-purple-50 dark:focus:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300 focus:text-purple-700 dark:focus:text-purple-300 transition-colors duration-200 text-gray-900 dark:text-white cursor-pointer"
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
